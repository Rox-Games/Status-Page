commit=true
origin=$(git remote get-url origin)
if [[ $origin == *statsig-io/statuspage* ]]
then
  commit=false
fi


if [[ $commit == true ]]
then
  git config --global user.name 'manshaaazar'
  git config --global user.email 'manshaehsan000@gmail.com'
  git add -A --force public/status/
  git commit -am '[Automated] Update Health Check Logs'
  git push
fi
