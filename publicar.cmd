@echo off
setlocal

cd /d "%~dp0"

set "MENSAGEM=%~1"
if not defined MENSAGEM set "MENSAGEM=Atualiza o site do casamento"

echo.
echo [1/4] Verificando a qualidade do projeto...
call npm.cmd run lint
if errorlevel 1 goto :erro

call npx.cmd tsc --noEmit
if errorlevel 1 goto :erro

echo.
echo [2/4] Preparando os arquivos...
git add -A
if errorlevel 1 goto :erro

git diff --cached --quiet
if not errorlevel 1 goto :sem_alteracoes

echo.
echo [3/4] Criando o commit...
git commit -m "%MENSAGEM%"
if errorlevel 1 goto :erro

echo.
echo [4/4] Enviando ao GitHub...
git push -u origin HEAD
if errorlevel 1 goto :erro

echo.
echo Tudo certo! As alteracoes foram enviadas ao GitHub.
exit /b 0

:sem_alteracoes
echo.
echo Nao existem novas alteracoes para publicar.
exit /b 0

:erro
echo.
echo A publicacao foi interrompida porque uma etapa apresentou erro.
exit /b 1
