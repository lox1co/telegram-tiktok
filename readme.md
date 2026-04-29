npm i
npm i -g ts-node

pm2 start src/index.ts --name tiktok-bot --node-args="--loader ts-node/esm" --interpreter node

pm2 save
