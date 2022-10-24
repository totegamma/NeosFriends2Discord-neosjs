FROM node:16

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./
COPY src/* ./src/

RUN npm i
RUN npm run build

CMD ["npm", "run", "start"]

