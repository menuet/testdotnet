@ECHO OFF

ECHO.Setting properties:
FOR /F "delims=:; tokens=1,*" %%I IN (%2) DO CALL :FN_DISPLAYPROPERTIES "%%J"

ECHO.Building targets:
FOR /F "delims=:; tokens=1,*" %%I IN (%1) DO CALL :FN_DISPLAYTARGETS "%%J"

IF "%VS120COMNTOOLS%" == "" (
	SET MSBUILD_EXE_PATH="C:\Windows\Microsoft.NET\Framework64\v4.0.30319\MSBuild.exe"
	SET VISUALSTUDIO_VERSION=-p:VisualStudioVersion=11.0
) ELSE (
	IF "%VS140COMNTOOLS%" == "" (
		SET MSBUILD_EXE_PATH="C:\Program Files (x86)\MSBuild\12.0\Bin\MSBuild.exe"
		SET VISUALSTUDIO_VERSION=-p:VisualStudioVersion=12.0
	) ELSE (
		SET MSBUILD_EXE_PATH="C:\Program Files (x86)\MSBuild\14.0\Bin\MSBuild.exe"
		SET VISUALSTUDIO_VERSION=-p:VisualStudioVersion=14.0
	)
)

%MSBUILD_EXE_PATH% "%~dp0\Pixl.Build.proj" %VISUALSTUDIO_VERSION% -nr:false %1 %2 -p:PixlPropSvnCurrentRevision=0 1>"%~dp0\Pixl.Build.Logs.txt" 2>&1
IF ERRORLEVEL 1 GOTO :ERR
GOTO :EOF

:FN_DISPLAYPROPERTIES
IF "%~1" EQU "" GOTO :EOF
FOR /F "delims=; tokens=1,*" %%I IN (%1) DO CALL :FN_DISPLAYPROPERTY "%%I" "%%J"
EXIT /B 0
GOTO :EOF

:FN_DISPLAYPROPERTY
ECHO.  %~1
CALL :FN_DISPLAYPROPERTIES "%~2"
GOTO :EOF

:FN_DISPLAYTARGETS
IF "%~1" EQU "" GOTO :EOF
FOR /F "delims=; tokens=1,*" %%I IN (%1) DO CALL :FN_DISPLAYTARGET "%%I" "%%J"
EXIT /B 0
GOTO :EOF

:FN_DISPLAYTARGET
ECHO.  %~1
CALL :FN_DISPLAYTARGETS "%~2"
GOTO :EOF

:ERR
ECHO.An error occured while building targets.>&2
ECHO.See log file for additional details.>&2
START /I /WAIT %~dp0\Pixl.Build.logs.txt
EXIT /B 1
GOTO :EOF
