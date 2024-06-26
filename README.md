<!-- TOC -->
* [How run it?](#how-run-it)
  * [In first - prepare files:](#in-first---prepare-files)
  * [In second:](#in-second)
<!-- TOC -->

# How run it?
## In first - prepare files:
1. create `.env` file in root project dir:
```env
POSTGRES_USER=yourvalue
POSTGRES_PASSWORD=yourvalue
POSTGRES_DB=yourvalue
VITE_API_URL=https://localhost:8443
```
2. Copy or create your ssl files to `docker/nginx/ssl`, like below:
```bash
$ ls -l docker/nginx/ssl
total 16
-rwxrwxrwx  1 davy1ex  staff  1119 Jun 14 15:51 selfsigned.crt
-rwxrwxrwx  1 davy1ex  staff  1704 Jun 14 15:51 selfsigned.key
```


## In second:
```bash
docker-compose up -d --build
```
After first build:
1. Enter in your docker node container like below and exec `npm install`
```bash
docker-compose run --rm node sh
npm install
```
2. Make simmilar with `composer install` for `php-fpm` container
3. Rerun docker-compose with 
```bash
docker-compose down && docker-compose up -d
```