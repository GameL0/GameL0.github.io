FROM node:lts-slim

WORKDIR ./app
COPY package.json package-lock.json .
RUN npm ci
COPY . .
RUN npm run db:generate
EXPOSE 3000
CMD ["npm", "db:migrate"]
CMD ["node", "./app.js"]