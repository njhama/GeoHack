FROM node:latest as builder

WORKDIR /usr/src/app

COPY ../package*.json ./

RUN npm install

COPY . .

RUN npm run dev

FROM node:latest

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/next.config.js ./

RUN npm install --only=production

EXPOSE 3003

CMD ["npm", "run", "dev"]
