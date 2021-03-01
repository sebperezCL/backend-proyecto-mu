#ssh MU-NODE 'sudo -u node -i' <<< "cd node-mu && git pull && pm2 restart www"

#branch dev
deploy () {
  echo " _ _ " 
  echo " _ _| |__ _ _ _ __ | |_ _ _ " 
  echo "| | | | '_ \| | | | '_ \| __| | | |"
  echo "| |_| | |_) | |_| | | | | |_| |_| |" 
  echo " \__,_|_.__/ \__,_|_| |_|\__|\__,_|"

  echo "Script de despliegue........." 
  echo "este script añade todos los cambios commitea y pushea"
  git add .
  git commit -m "Commit deploy script in dev"
  ssh MU-NODE 'sudo -u node -i' <<< 'cd node-mu && git checkout $1 && git pull && pm2 restart www'
}

deploy

