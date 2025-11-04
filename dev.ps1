try {
  npm run dev
}
finally {
  Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
  if (Test-Path .next) { Remove-Item .next -Recurse -Force }
  if (Test-Path .turbo) { Remove-Item .turbo -Recurse -Force }
  Write-Host 'Dev server stopped, cache cleaned.'
}
