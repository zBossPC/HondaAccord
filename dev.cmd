@echo off
cd /d "%~dp0"
echo Starting HondaAccord...
call pnpm.cmd tauri dev
if errorlevel 1 pause
