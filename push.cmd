@echo off
REM ============================================================
REM  push.cmd  —  one-click publish for kylekramer.ai
REM ------------------------------------------------------------
REM  Run this file (double-click or `push` in a terminal) to push
REM  the site to GitHub. Vercel auto-deploys whatever is on GitHub.
REM
REM  FIRST TIME ONLY: confirm the two settings below are correct,
REM  then make sure you have Git installed (https://git-scm.com).
REM ============================================================

setlocal

REM ---- EDIT THESE TWO IF NEEDED -------------------------------
set "REPO_URL=https://github.com/SixSigmaEngineer/kylekramer.ai.git"
set "BRANCH=main"
REM ------------------------------------------------------------

cd /d "%~dp0"

echo.
echo ===============================================
echo   Publishing kylekramer.ai
echo   Repo:   %REPO_URL%
echo   Branch: %BRANCH%
echo ===============================================
echo.

REM --- Check git is available ---
where git >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Git is not installed or not on your PATH.
  echo Download it from https://git-scm.com/download/win then run this again.
  echo.
  pause
  exit /b 1
)

REM --- Initialise repo on first run ---
if not exist ".git" (
  echo First run: initialising local git repository...
  git init
  git branch -M %BRANCH%
)

REM --- Make sure the remote 'origin' points at your repo ---
git remote get-url origin >nul 2>nul
if errorlevel 1 (
  git remote add origin %REPO_URL%
) else (
  git remote set-url origin %REPO_URL%
)

REM --- Ask for a commit message (optional) ---
set "MSG=%*"
if "%MSG%"=="" set /p "MSG=Commit message (press Enter for default): "
if "%MSG%"=="" set "MSG=Update site"

echo.
echo Staging files...
git add -A

echo Committing...
git commit -m "%MSG%"
if errorlevel 1 (
  echo (Nothing new to commit — continuing to push.)
)

echo Pushing to GitHub...
git push -u origin %BRANCH%
if errorlevel 1 (
  echo.
  echo [ERROR] Push failed. Common fixes:
  echo   - Make sure the repo exists at the URL above and is empty/yours.
  echo   - Sign in when Git/GitHub prompts you in the browser.
  echo.
  pause
  exit /b 1
)

echo.
echo ===============================================
echo   Done. Vercel will deploy automatically.
echo   Check https://vercel.com/dashboard
echo ===============================================
echo.
pause
endlocal
