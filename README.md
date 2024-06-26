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
<br>[optional] If u not have prefered JWT setup - create new:
3. 
  ```bash
openssl genpkey -algorithm RSA -out config/jwt/private.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem
```
Then add JWT to `backend/.env`
```bash
###> lexik/jwt-authentication-bundle ###
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=your_jwt_passphrase
###< lexik/jwt-authentication-bundle ###

```
Also add to `backend/config/packages/lexik_jwt_authentication.yaml` something like below:
```yaml
lexik_jwt_authentication:
    secret_key: '%kernel.project_dir%/config/jwt/private.pem' # path to the private key
    public_key: '%kernel.project_dir%/config/jwt/public.pem'  # path to the public key
    pass_phrase: 'your_jwt_passphrase' # this is the passphrase you used when generating the keys
    token_ttl: 3600

```
4. Rerun docker-compose with 
```bash
docker-compose down && docker-compose up -d
```