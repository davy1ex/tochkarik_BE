FROM node:18

WORKDIR /frontend

COPY frontend/tochkarik/package.json .
COPY . .

RUN chown -R node:node /frontend

USER node

EXPOSE 5173

CMD ["npm", "run", "dev"]

