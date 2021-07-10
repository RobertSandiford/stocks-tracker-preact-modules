FROM node:14
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
WORKDIR src
CMD ["npm", "run", "docker-watch"]

