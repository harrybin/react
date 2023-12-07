using namespace System.Management.Automation.Host

Import-Module (Join-Path $PSScriptRoot "TemplateGenerator") -Force


Write-Banner

# Select the mode
$isCleared = New-Object ChoiceDescription "&Cleared", "⚡ Lightweight boilerplate"
$isIntermediate = New-Object ChoiceDescription "&Intermediate", "🛠️ Commented Examples and best-practices"
$isFull = New-Object ChoiceDescription "&Full", "🚀 Additional examples and best-practices"

$mode = $host.UI.PromptForChoice("-- Mode --", "Choose a template", @(
    [ChoiceDescription[]]($isCleared, $isIntermediate, $isFull)
  ), 0)
$chosenMode = [Enum]::Parse([TemplateMode], $mode)

# Project name and description
$projectName = Read-Host -Prompt "Enter project name"
if (!($projectName)) {
  Write-Warning "No project name entered. Aborting."
  return
}
$projectDescription = Read-Host -Prompt "Provide short description of your project. (optional)"

# Execute the Generator
Rename-Template -Path $PSScriptRoot -ProjectName $projectName -ProjectDescription $projectDescription
Convert-Template -Path $PSScriptRoot -Mode $chosenMode
Clear-Tools
