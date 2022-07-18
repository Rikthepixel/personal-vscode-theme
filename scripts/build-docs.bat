@echo off

cd ../
if exist dist (
    echo Build docs: Clearing dist folder
    rmdir /s /q dist
)

mkdir dist

echo Build docs: Copying docs to dist
xcopy /y /e /i docs dist >NUL

if not exist dist/assets/ (
    echo Build docs: Creating assets folder
    cd ./dist
    mkdir assets
    cd ../
)

@echo on