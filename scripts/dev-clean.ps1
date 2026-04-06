param()

$ports = @(3000, 4000)
$connections = Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | Where-Object { $ports -contains $_.LocalPort }

$pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
foreach ($procId in $pids) {
  if (Get-Process -Id $procId -ErrorAction SilentlyContinue) {
    Write-Host "Deteniendo proceso PID $procId..."
    Stop-Process -Id $procId -Force
  }
}

Start-Sleep -Seconds 1

$nextPath = Join-Path $PSScriptRoot '..\apps\web\.next'
if (Test-Path $nextPath) {
  Write-Host "Limpiando cache Next.js en $nextPath..."
  Remove-Item -LiteralPath $nextPath -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host "Iniciando entorno de desarrollo..."
npm.cmd run dev
