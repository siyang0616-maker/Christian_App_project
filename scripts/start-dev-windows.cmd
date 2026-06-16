@echo off
setlocal
cd /d "%~dp0.."
set "PATH=C:\Program Files\nodejs;%SystemRoot%\System32;%SystemRoot%"
"C:\Program Files\nodejs\node.exe" "%CD%\node_modules\next\dist\bin\next" dev --hostname 127.0.0.1 --port %1
