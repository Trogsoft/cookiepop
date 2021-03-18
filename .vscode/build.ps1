$code = Get-Content "src/trogsoft.cookiepop.js";
$langFiles = Get-ChildItem "src/lang/" -Filter *.js
$output = New-Item "dist" -ItemType Directory -Force
foreach ($lang in $langFiles) {
    $fileParts = $lang.Name.Split('.');
    $language = $fileParts[$fileParts.Count - 2];
    $content = Get-Content $lang.FullName;
    $langCode = $code + "`r`n`r`n" + $content;
    Remove-Item "dist/trogsoft.cookiepop.$language.js" -Force
    Add-Content -Path "dist/trogsoft.cookiepop.$language.js" -Value $langCode
    minify "dist/trogsoft.cookiepop.$language.js" >"dist/trogsoft.cookiepop.$language.min.js"
}