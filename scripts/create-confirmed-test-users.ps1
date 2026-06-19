param(
  [string]$LeaderEmail,
  [string]$MemberEmail,
  [string]$Password,
  [switch]$Json
)

$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$helper = Join-Path $PSScriptRoot "create-confirmed-test-users.mjs"

Write-Host "Paste the Supabase service_role key for this one local command."
Write-Host "It will not be printed, stored in .env.local, or written to the repo."
$secureKey = Read-Host "SUPABASE_SERVICE_ROLE_KEY" -AsSecureString
$plainKey = [System.Net.NetworkCredential]::new("", $secureKey).Password

if ([string]::IsNullOrWhiteSpace($plainKey)) {
  throw "SUPABASE_SERVICE_ROLE_KEY is required."
}

$previousKey = [Environment]::GetEnvironmentVariable("SUPABASE_SERVICE_ROLE_KEY", "Process")
$env:SUPABASE_SERVICE_ROLE_KEY = $plainKey

try {
  $argsList = @($helper)

  if ($LeaderEmail) {
    $argsList += @("--leader-email", $LeaderEmail)
  }

  if ($MemberEmail) {
    $argsList += @("--member-email", $MemberEmail)
  }

  if ($Password) {
    $argsList += @("--password", $Password)
  }

  if ($Json) {
    $argsList += "--json"
  }

  Push-Location $projectRoot
  try {
    & node @argsList
    if ($LASTEXITCODE -ne 0) {
      exit $LASTEXITCODE
    }
  } finally {
    Pop-Location
  }
} finally {
  if ($null -ne $previousKey) {
    $env:SUPABASE_SERVICE_ROLE_KEY = $previousKey
  } else {
    Remove-Item Env:\SUPABASE_SERVICE_ROLE_KEY -ErrorAction SilentlyContinue
  }
}
