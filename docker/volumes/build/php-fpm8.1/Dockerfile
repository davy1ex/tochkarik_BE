FROM php:8.1-fpm


FROM php:8.1-fpm

# Установка Xdebug
RUN pecl install xdebug \
    && docker-php-ext-enable xdebug

# Копирование настроек php.ini в контейнер
COPY ./docker/volumes/etc/php-fpm8.1/php.ini /usr/local/etc/php/php.ini

# Дополнительные команды для настройки Xdebug
RUN echo "xdebug.mode=debug" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.start_with_request=yes" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.client_host=host.docker.internal" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.client_port=9003" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
