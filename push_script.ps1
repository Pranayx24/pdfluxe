"FILE CONTENT CHECK" | Out-File -FilePath "run_log.txt" -Encoding utf8 -Append
Get-Content js/views/scan-ultra.js | Select-String "torchState" | Out-File -FilePath "run_log.txt" -Encoding utf8 -Append
git add js/views/scan-ultra.js 2>&1 | Out-File -FilePath "run_log.txt" -Encoding utf8 -Append
git commit -v -m "Check changes" 2>&1 | Out-File -FilePath "run_log.txt" -Encoding utf8 -Append
git push origin HEAD 2>&1 | Out-File -FilePath "run_log.txt" -Encoding utf8 -Append
"FINISHED PUSH" | Out-File -FilePath "run_log.txt" -Encoding utf8 -Append
