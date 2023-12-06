Import-Module (Join-Path $PSScriptRoot "Utils") -Force

enum TemplateMode {
  Cleared
  Intermediate
  Full
  None
}

$TEST_COMPONENT = "// ?EXAMPLE_COMPONENT"
$HASH_COMPONENT = "# ?EXAMPLE_COMPONENT[\s\S]*?\n"

$HASH_COMMENT_REPLACE = "# EXAMPLE_START([\s\S]*?)# EXAMPLE_END"
$TS_COMMENT_REPLACE = "/\s*\/\/\s*EXAMPLE_START[\s\S]*?\/\/\s*EXAMPLE_END/gm"
$TSX_COMMENT_REPLACE = "/(?:\{\/\*|\/\/) EXAMPLE_START \*\/\}[\s\S]*?(?:\{\/\*|\/\/) EXAMPLE_END \*\/\}/g"

function Get-SearchDirs {
  $rootPath = Split-Path -Path $PSScriptRoot -Parent
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

  $rootFiles = Get-Files -Path $rootPath
  return @($rootFiles + $files)
}

function ConvertTo-ClearedFile {
  param(
    [string]$FileName,
    [string]$FileContents,
    [string]$FileExtension
  )

  # delete test components
  if ($FileContents -match $TEST_COMPONENT -Or $FileContents -match $HASH_COMPONENT) {
    Write-Host $FileName
    # TODO delete this file
  }

  # replace contents of the remaining files
}

function Convert-Template {
  param(
    [TemplateMode]$Mode
  )
  $files = Get-SearchDirs
  $files | ForEach-Object {
    $fileName = $_.FullName
    $fileContents = Get-Content -Path $fileName -Raw
    $fileExtension = $_.Extension

    ConvertTo-Cleared -FileName $fileName -FileContents $fileContents -FileExtension $fileExtension
  }
}

Convert-Template -Mode ([TemplateMode]::Cleared)