ssh MU-NODE 'sudo -u node -i' <<< "cd node-mu && git pull && pm2 restart www"