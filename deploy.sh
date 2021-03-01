#ssh MU-NODE 'sudo -u node -i' <<< "cd node-mu && git pull && pm2 restart www"
source name.sh
#branch dev
deploy () {

  nameApp

  echo "Script de despliegue........." 
  echo "Este script añade todos los cambios commitea y pushea"
  echo "!!!!!!!!Estas seguro de los cambios !!!!!!!!!!"
  read -p " true|false " state
  
  if [[ $state = 'true' ]]
  then
    echo "Clona repo en servidor"
    git add .
    git commit -m "Commit deploy script in dev"
    sleep 4
    ssh MU-NODE 'sudo -u node -i' <<< 'cd node-mu && git checkout dev && git pull && git status && pm2 restart www'
  else
    exit 0
  fi
}

deploy

