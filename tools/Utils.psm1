$validFileExt = @('.ts', '.tsx', '.cfignore', '.yml', '.yaml', '.html', '.conf', '')

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


Export-ModuleMember Get-Files