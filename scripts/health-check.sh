commit=true
origin=$(git remote get-url origin)
if [[ $origin == *statsig-io/statuspage* ]]
then
  commit=false
fi

KEYSARRAY=()
URLSARRAY=()

urlsConfig="public/urls.cfg"
echo "Reading $urlsConfig"
while read -r line
do
  echo "  $line"
  IFS='=' read -ra TOKENS <<< "$line"
  KEYSARRAY+=(${TOKENS[0]})
  URLSARRAY+=(${TOKENS[1]})
done < "$urlsConfig"

echo "***********************"
echo "Starting health checks with ${#KEYSARRAY[@]} configs:"

mkdir -p logs

for (( index=0; index < ${#KEYSARRAY[@]}; index++))
do
  key="${KEYSARRAY[index]}"
  url="${URLSARRAY[index]}"
  echo "  $key=$url"

  for i in 1 2 3; 
  do
    response=$(curl --insecure -o /dev/null -s -w '%{http_code} %{time_total}' --silent --output /dev/null $url)
    http_code=$(echo $response | cut -d ' ' -f 1)
    time_total=$(echo $response | cut -d ' ' -f 2)
    echo "    $http_code $time_total"
    if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 202 ] || [ "$http_code" -eq 301 ] || [ "$http_code" -eq 302 ] || [ "$http_code" -eq 307 ]; then
      result="success"
    else
      result="failed"
    fi
    if [ "$result" = "success" ]; then
      break
    fi
    sleep 5
  done
  dateTime=$(date +'%Y-%m-%d %H:%M')
  if [[ $commit == true ]]
  then
    echo $dateTime, $result, $time_total >> "public/status/${key}_report.log"
    echo "$(tail -2000 public/status/${key}_report.log)" > "public/status/${key}_report.log"
  else
    echo "    $dateTime, $result, $time_total"
  fi
done

if [[ $commit == true ]]
then
  git config --global user.name 'manshaaazar'
  git config --global user.email 'manshaehsan000@gmail.com'
  git add -A --force public/status/
  git commit -am '[Automated] Update Health Check Logs'
  git push
fi


# Import the public key used by the package management system
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -


# Create a list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Reload local package database
sudo apt-get update

# Install the MongoDB shell package
sudo apt-get install -y mongodb-mongosh

# Connect to MongoDB using the shell and a connection string
connection_string="mongodb+srv://rox-user-1:59sJ9XGzaNKgTvxK@cluster0.bjskb.mongodb.net/Rox-Database?retryWrites=true&w=majority"
if mongo "$connection_string" --eval "quit()" &> /dev/null
then
  dateTime=$(date +'%Y-%m-%d %H:%M')
  result="success"
  echo $dateTime, $result, $time_total >> "public/status/Database_report.log"
  echo "$(tail -2000 public/status/${key}_report.log)" > "public/status/Database_report.log"
else
  dateTime=$(date +'%Y-%m-%d %H:%M')
  result="failed"
  echo $dateTime, $result, $time_total >> "public/status/Database_report.log"
  echo "$(tail -2000 public/status/${key}_report.log)" > "public/status/Database_report.log"
fi

