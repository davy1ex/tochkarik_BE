# frontend/Dockerfile

FROM node:18-alpine
# docker-compose run --rm node sh
#
WORKDIR /frontend

COPY ./frontend/tochkarik/package*.json ./

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
