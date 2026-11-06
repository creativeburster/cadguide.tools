# Build script for the CADGuide.tools Rust + WebAssembly CAD Trilogy Suite
# Supports both full cargo/wasm-pack compilation and deterministic Node WASM binary emission.

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

Write-Host "=== Building CADGuide.tools WebAssembly CAD Trilogy Kernels ===" -ForegroundColor Cyan

if (Get-Command wasm-pack -ErrorAction SilentlyContinue) {
    Write-Host "wasm-pack detected, building crates from packages/rust-cad-suite..." -ForegroundColor Green
    wasm-pack build packages/rust-cad-suite/wasm-targets/wasm-parametric-cad --target web --release --out-dir "$RepoRoot/public/wasm" --out-name parametric_cad
    wasm-pack build packages/rust-cad-suite/wasm-targets/wasm-nesting-cam --target web --release --out-dir "$RepoRoot/public/wasm" --out-name nesting_cam
    wasm-pack build packages/rust-cad-suite/wasm-targets/wasm-code-cad --target web --release --out-dir "$RepoRoot/public/wasm" --out-name code_cad
} else {
    Write-Host "Running deterministic IEEE-754 WASM kernel emitter (scripts/compile-wasm-kernels.js)..." -ForegroundColor Yellow
    node "$PSScriptRoot/compile-wasm-kernels.js"
}

Write-Host "=== WASM Suite Build Complete ===" -ForegroundColor Green
