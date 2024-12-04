FROM node:18
# docker-compose run --rm node sh

RUN apt-get update && apt-get install -y \
    vim \
    zip \
    unzip \
    curl

WORKDIR /frontend

COPY frontend/tochkarik/package.json frontend/package-lock.json ./
RUN npm install --unsafe-perm

COPY . .

RUN chown -R node:node /frontend

USER node

EXPOSE 5173

CMD ["npm", "run", "dev"]

