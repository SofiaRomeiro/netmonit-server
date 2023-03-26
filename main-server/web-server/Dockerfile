FROM node:12

WORKDIR /main-server/web-server

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

# map server port to docker daemon
EXPOSE 8080

CMD ["node", "index.js"]
