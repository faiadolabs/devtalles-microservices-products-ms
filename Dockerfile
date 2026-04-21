FROM node:24-alpine3.22

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./


RUN npm install

COPY . .

# Esto funciona bien aquí, porque la db es sqlite y está autocontenida en la imagen (no depende de otro container)
RUN npx prisma generate


EXPOSE 3001