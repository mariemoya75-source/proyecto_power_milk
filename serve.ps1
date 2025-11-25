Param(
    [int]$Port = 8000,
    [string]$Root = (Get-Location).Path
)

# Simple static file server using HttpListener. Serves files from $Root on http://localhost:$Port/
# Uso: .\serve.ps1 -Port 8000

try {
    $prefix = "http://localhost:$Port/"
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add($prefix)
    $listener.Start()
    Write-Host "Serving '$Root' on $prefix"
    Write-Host "Presiona Ctrl+C para detener."

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        # Manejar cada request en un Job para no bloquear el loop principal
        Start-Job -ArgumentList $context,$Root -ScriptBlock {
            param($ctx,$root)
            try {
                $req = $ctx.Request
                $res = $ctx.Response
                $urlPath = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath)
                if ($urlPath -eq "/") { $urlPath = "/index.html" }
                # Prevenir path traversal
                $relative = $urlPath.TrimStart('/') -replace '\\.\\.', ''
                $localPath = Join-Path $root ($relative -replace '/', '\\')

                if (-not (Test-Path $localPath)) {
                    $res.StatusCode = 404
                    $res.ContentType = 'text/plain; charset=utf-8'
                    $buf = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                    $res.OutputStream.Write($buf,0,$buf.Length)
                    $res.Close()
                    return
                }

                $bytes = [System.IO.File]::ReadAllBytes($localPath)
                $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
                switch ($ext) {
                    '.html' { $ctype='text/html; charset=utf-8' }
                    '.htm'  { $ctype='text/html; charset=utf-8' }
                    '.js'   { $ctype='application/javascript; charset=utf-8' }
                    '.css'  { $ctype='text/css; charset=utf-8' }
                    '.png'  { $ctype='image/png' }
                    '.jpg'  { $ctype='image/jpeg' }
                    '.jpeg' { $ctype='image/jpeg' }
                    '.gif'  { $ctype='image/gif' }
                    '.svg'  { $ctype='image/svg+xml' }
                    '.json' { $ctype='application/json; charset=utf-8' }
                    '.pdf'  { $ctype='application/pdf' }
                    default { $ctype='application/octet-stream' }
                }

                $res.ContentType = $ctype
                $res.ContentLength64 = $bytes.Length
                $res.OutputStream.Write($bytes,0,$bytes.Length)
                $res.Close()
            } catch {
                Write-Host "Error atendiendo petición: $_"
            }
        } | Out-Null
    }
} catch {
    Write-Host "Error iniciando el servidor: $_" -ForegroundColor Red
    Write-Host "Si el puerto está en uso, prueba con: .\\serve.ps1 -Port 8080"
} finally {
    if ($listener -and $listener.IsListening) {
        $listener.Stop()
        $listener.Close()
    }
}
