# Usage: powershell -ExecutionPolicy Bypass -File run5.ps1 <suite1.js> [suite2.js ...]
# Runs each E2E suite 5 times; prints exit code and PASS/FAIL counts per run; prints full output on failure.
$Suites = $args
Set-Location F:\cadguide.tools
if ($Suites.Count -eq 0) { Write-Output "Usage: run5.ps1 <suite.js> [...]"; exit 2 }
$allOk = $true
foreach ($s in $Suites) {
  for ($i = 1; $i -le 5; $i++) {
    $out = node $s 2>&1 | Out-String
    $code = $LASTEXITCODE
    $pass = ([regex]::Matches($out, '\[PASS\]')).Count
    $fail = ([regex]::Matches($out, '\[FAIL\]')).Count
    Write-Output ("{0} run{1} exit={2} PASS={3} FAIL={4}" -f $s, $i, $code, $pass, $fail)
    if ($fail -gt 0 -or $code -ne 0 -or $pass -eq 0) { $allOk = $false; Write-Output $out }
  }
}
if ($allOk) { Write-Output "ALL RUNS PASSED" } else { Write-Output "SOME RUNS FAILED"; exit 1 }