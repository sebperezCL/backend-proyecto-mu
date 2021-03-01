#ssh MU-NODE 'sudo -u node -i' <<< "cd node-mu && git pull && pm2 restart www"

#branch dev
deploy () {
  ssh MU-NODE 'sudo -u node -i' <<< 'cd node-mu && git checkout dev && git pull && pm2 restart www'
}

deploy
