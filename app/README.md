<!-- TOC -->
* [How run it?](#how-run-it)
  * [In first - run docker:](#in-first---run-docker)
  * [In second (if it ur first run)](#in-second-if-it-ur-first-run)
<!-- TOC -->

# How run it?
## In first - run docker:
```bash
docker-compose up -d --build
```

## In second (if it ur first run)
Go to php container and install Symfony.
For that u need know id of your docker container. For these u should run:
```bash
docker ps
```
And u see smth like that:
```Bash
➜  2task git:(master) ✗ docker ps               
CONTAINER ID   IMAGE         COMMAND                  CREATED          STATUS          PORTS                NAMES
d0f5a881afe0   2task-nginx   "/docker-entrypoint.…"   10 minutes ago   Up 10 minutes   0.0.0.0:80->80/tcp   2task-nginx-1
fbec090ab18a   2task-php     "docker-php-entrypoi…"   10 minutes ago   Up 10 minutes   9000/tcp             2task-php-1
```
Then u need put CONTAINER ID of ur php image *(in my case it 2task-php)* to next command:
```bash
docker exec -it CONTAINER_ID bash 
```
Where `CONTAINER_ID` is ur CONTAINER ID from `docker ps`

