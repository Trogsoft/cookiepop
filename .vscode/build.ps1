$code = Get-Content "src/trogsoft.cookiepop.js";
$langFiles = Get-ChildItem "src/lang/" -Filter *.js
$output = New-Item "dist" -ItemType Directory -Force
$allLang = $code;
foreach ($lang in $langFiles) {
    $fileParts = $lang.Name.Split('.');
    $language = $fileParts[$fileParts.Count - 2];
    $content = Get-Content $lang.FullName;
    $allLang = $allLang + "`r`n" + $content;
    $langCode = $code + "`r`n`r`n" + $content;

    # Specific language versions
    Remove-Item "dist/trogsoft.cookiepop.$language.js" -Force
    Add-Content -Path "dist/trogsoft.cookiepop.$language.js" -Value $langCode
    minify "dist/trogsoft.cookiepop.$language.js" >"dist/trogsoft.cookiepop.$language.min.js"

    # All Languages
    Remove-Item "dist/trogsoft.cookiepop.global.js" -Force
    Add-Content -Path "dist/trogsoft.cookiepop.global.js" -Value $allLang
    minify "dist/trogsoft.cookiepop.global.js" >"dist/trogsoft.cookiepop.global.min.js"

    # CSS
    node-sass "src/trogsoft.cookiepop.scss" "dist/trogsoft.cookiepop.css"
    minify "dist/trogsoft.cookiepop.css" >"dist/trogsoft.cookiepop.min.css"

}