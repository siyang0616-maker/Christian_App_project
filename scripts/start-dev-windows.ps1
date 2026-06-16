param(
  [int]$Port = 3010
)

$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$node = "C:\Program Files\nodejs\node.exe"
$next = Join-Path $projectRoot "node_modules\next\dist\bin\next"
$outLog = Join-Path $projectRoot "donghaeng-dev.out.log"
$errLog = Join-Path $projectRoot "donghaeng-dev.err.log"

$env:PATH = "C:\Program Files\nodejs;" + [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [Environment]::GetEnvironmentVariable("Path", "User")
Remove-Item Env:Path -ErrorAction SilentlyContinue

Start-Process `
  -FilePath $node `
  -ArgumentList "`"$next`" dev --hostname 127.0.0.1 --port $Port" `
  -WorkingDirectory $projectRoot `
  -WindowStyle Hidden `
  -RedirectStandardOutput $outLog `
  -RedirectStandardError $errLog `
  -PassThru
