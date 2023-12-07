$validFileExt = @('.ts', '.tsx', '.cfignore', '.yml', '.yaml', '.html', '.conf', '')

Add-Type @'
public enum TemplateMode {
  Cleared,
  Intermediate,
  Full,
  None,
}
'@

$TEST_COMPONENT = "// ?EXAMPLE_COMPONENT"
$HASH_COMPONENT = "# ?EXAMPLE_COMPONENT[\s\S]*?\n"

$HASH_COMMENT_REPLACE = "# EXAMPLE_START([\s\S]*?)# EXAMPLE_END"
$TS_COMMENT_REPLACE = "\s*//\s*EXAMPLE_START([\s\S]*?)//\s*EXAMPLE_END"
$TSX_COMMENT_REPLACE = "(?:\{/\*|//) EXAMPLE_START \*/\}([\s\S]*?)(?:\{/\*|//) EXAMPLE_END \*/\}"

$changedCount = 0
$deletedCount = 0

function Write-Banner {
  $banner = @"
   __   __  _______  ___   ______    ___   _______ 
  |  |_|  ||       ||   | |    _ |  |   | |       |
  |       ||    _  ||   | |   | ||  |   | |_     _|
  |       ||   |_| ||   | |   |_||_ |   |   |   |  
   |     | |    ___||   | |    __  ||   |   |   |  
  |   _   ||   |    |   | |   |  | ||   |   |   |  
  |__| |__||___|    |___| |___|  |_||___|   |___|  

  REACT TEMPLATE GENERATOR:
  #########################
                           
"@

  Write-Host $banner -ForegroundColor Yellow
}

function Get-Files {
  param (
    [string]$Path,
    [bool]$Recurse
  )

  $params = @{
    Path = $Path
    File = $true
  }

  if ($Recurse) {
    $params['Recurse'] = $true
  }

  Get-ChildItem @params |
  Where-Object { $_.Extension -in $validFileExt }
}

function Find-Files {
  param (
    [string]$Path
  )

  # since the script is inside "/tools" folder
  $rootPath = Split-Path -Path $Path -Parent
  $srcPath = Join-Path $rootPath 'src'
  $nginxPath = Join-Path $rootPath 'nginx'
  $playwrightPath = Join-Path $rootPath 'playwrightTests'
  $publicPath = Join-Path $rootPath 'public'

  $paths = @($srcPath, $nginxPath, $playwrightPath, $publicPath)
  $files = @()

  foreach ($path in $paths) {
    $recursiveFiles = Get-Files -Path $path -Recurse $true
    $files += $recursiveFiles
  }

  $rootFiles = Get-Files -Path $rootPath -Recurse $false
  return @($rootFiles + $files)
}

function Get-RegexMap {
  param(
    [string]$FileExtension
  )

  switch ($FileExtension) {
    '.ts' {
      return @($TS_COMMENT_REPLACE)
    }
    '.tsx' {
      return @($TSX_COMMENT_REPLACE, $TS_COMMENT_REPLACE)
    }
    '.cfignore' {
      return @($HASH_COMMENT_REPLACE)
    }
    '.yaml' {
      return @($HASH_COMMENT_REPLACE)
    }
    '.yml' {
      return @($HASH_COMMENT_REPLACE)
    }
    '' {
      return @($HASH_COMMENT_REPLACE)
    }
    Default {
      Write-Information "Unknown File Extension '$FileExtension'"
    }
  }
}

function ConvertTo-ClearedFile {
  param(
    [string]$FileName,
    [string]$FileContents,
    [string]$FileExtension
  )

  # delete test components
  if ($FileContents -match $TEST_COMPONENT -Or $FileContents -match $HASH_COMPONENT) {
    Remove-Item -Path $FileName
    $deletedCount++
    return $FileContents
  }

  $replacedContent = $FileContents
  # replace contents of the remaining files
  $regex = Get-RegexMap -FileExtension $FileExtension
  $regex | ForEach-Object {
    $replacedContent = $replacedContent -replace $_, ""
  }

  return $replacedContent
}

function ConvertTo-IntermediateFile {
  param(
    [string]$FileName,
    [string]$FileContents,
    [string]$FileExtension
  )

  # replace to tsx comments
  # $1 has to be escaped for using the capture group
  $tsxReplaced = $FileContents -replace $TSX_COMMENT_REPLACE, "{/* `$1 */}"

  # replace ts comments
  $tsReplaced = $tsxReplaced -replace $TS_COMMENT_REPLACE, "`n/* `$1 */"

  # find all hash comments and for each match, split the text into lines and prepend a double slash
  $hashMatches = [regex]::Matches($tsReplaced, $HASH_COMMENT_REPLACE)
  $hashReplaced = $tsReplaced
  foreach ($match in $hashMatches) {
    $blockContent = $match.Groups[1].Value
    $lines = $blockContent -split "`r?`n"
    $replacement = $lines -join "`n// "
    $hashReplaced = $hashReplaced -replace [regex]::Escape($match.Value), $replacement
  }

  return $hashReplaced
}

function ConvertTo-FullFile {
  param(
    [string]$FileName,
    [string]$FileContents,
    [string]$FileExtension
  )
  return $FileContents
}

function Convert-Template {
  param(
    [string]$Path,
    [TemplateMode]$Mode
  )

  $files = Find-Files -Path $Path

  $files | ForEach-Object {
    $fileName = $_.FullName
    $fileContents = Get-Content -Path $fileName -Raw
    $fileExtension = $_.Extension

    $result = ""
    switch ($Mode) {
      ([TemplateMode]::Cleared) {
        $result = ConvertTo-ClearedFile -FileName $fileName -FileContents $fileContents -FileExtension $fileExtension
      }
      ([TemplateMode]::Intermediate) {
        $result = ConvertTo-IntermediateFile -FileName $fileName -FileContents $fileContents -FileExtension $fileExtension
      }
      ([TemplateMode]::Full) {
        $result = ConvertTo-FullFile -FileName $fileName -FileContents $fileContents -FileExtension $fileExtension
      }
      Default {}
    }
    if (!($fileContents -eq $result)) {
      Set-Content -Path $fileName -Value $result
      $changedCount++
      return
    }
  }

  Write-Host $changedCount
}

function Rename-Template {
  param (
    [string]$Path,
    [string]$ProjectName,
    [string]$ProjectDescription
  )

  $rootPath = Split-Path -Path $Path -Parent
  $packageJsonFileName = Join-Path $rootPath "package.json"
  if (!(Test-Path -Path $packageJsonFileName)) {
    Write-Error "no package.json file found at '$packageJsonFileName'"
  }
  
  $packageJson = Get-Content -Path $packageJsonFileName -Raw | ConvertFrom-Json

  $packageJson.name = $ProjectName
  $packageJson.description = $ProjectDescription
  $packageJson.author = ""

  Set-Content -Path $packageJsonFileName (ConvertTo-Json $packageJson -Depth 4)
}

function Clear-Tools {
  $toolsFolderPath = $PSScriptRoot
  Remove-Item -Path $toolsFolderPath -Recurse -Force
}

Export-ModuleMember Write-Banner
Export-ModuleMember Rename-Template
Export-ModuleMember Convert-Template
Export-ModuleMember Clear-Tools
