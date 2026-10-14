param (
    [string]$OutZip = "cadguide_source.zip"
)

if (Test-Path $OutZip) {
    Remove-Item $OutZip -Force
}

Write-Host "Creating git archive base..."
& git archive -o $OutZip HEAD

# 检查是否有未跟踪或修改的文件需要更新进 zip
$untracked = & git status -s
Write-Host "Worktree changes: $untracked"

Write-Host "Packing finished successfully: $OutZip"
