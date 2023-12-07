Import-Module (Join-Path $PSScriptRoot "Utils") -Force


Write-Banner

$isCleared = New-Object System.Management.Automation.Host.ChoiceDescription "&Cleared", "⚡ Lightweight boilerplate"
$isIntermediate = New-Object System.Management.Automation.Host.ChoiceDescription "&Intermediate", "🛠️ Commented Examples and best-practices"
$isFull = New-Object System.Management.Automation.Host.ChoiceDescription "&Full", "🚀 Additional examples and best-practices"

$chosenMode = $host.UI.PromptForChoice("-- Mode --", "Choose a template", @(
    [System.Management.Automation.Host.ChoiceDescription[]]($isCleared, $isIntermediate, $isFull)
  ), 0)

$projectName = Read-Host -Prompt "Enter project name"
if (!($projectName)) {
  Write-Warning "No project name entered. Aborting."
  return
}
$projectDescription = Read-Host -Prompt "Provide short description of your project. (optional)"

Rename-Template -Path $PSScriptRoot -ProjectName $projectName -ProjectDescription $projectDescription
# Convert-Template -Path $PSScriptRoot -Mode ([TemplateMode]::Intermediate)