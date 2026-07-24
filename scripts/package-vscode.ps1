$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$vscodeDir = Join-Path $root "packages/kilo-vscode"

Write-Host "Building VS Code extension..."
Set-Location $vscodeDir
bun run compile
if ($LASTEXITCODE -ne 0) {
  Write-Error "Extension build failed"
  exit 1
}

Write-Host "Packaging VS Code extension..."
npx vsce package --no-dependencies
if ($LASTEXITCODE -ne 0) {
  Write-Error "VSIX packaging failed"
  exit 1
}

$vsix = Get-ChildItem -Path $vscodeDir -Filter "*.vsix" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $vsix) {
  Write-Error "No .vsix file found in $vscodeDir"
  exit 1
}

$dest = Join-Path $root $vsix.Name
Copy-Item -Path $vsix.FullName -Destination $dest -Force
Write-Host "Copied $($vsix.Name) to $dest"
