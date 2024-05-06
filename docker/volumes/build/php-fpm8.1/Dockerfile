FROM php:8.1-fpm


ARG INSTALL_XDEBUG=false
RUN if [ ${INSTALL_XDEBUG} = true ]; \
    then \
        # Установка Xdebug 
        pecl install xdebug && docker-php-ext-enable xdebug; \
    fi;


RUN apt-get update && apt-get install -y \
        libzip-dev \
        libicu-dev \
        libpq-dev \
        git \
        unzip \
    && docker-php-ext-install \
        pdo \
        pdo_mysql \
        zip \
        intl \
        opcache \
    && pecl install apcu \
    && docker-php-ext-enable apcu







# Дополнительные команды для настройки Xdebug
RUN echo "xdebug.mode=debug" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.start_with_request=yes" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.client_host=host.docker.internal" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.client_port=9003" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini





# Установка Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer



# Копирование настроек php.ini в контейнер
COPY ./docker/volumes/etc/php-fpm8.1/php.ini /usr/local/etc/php/php.ini
WORKDIR /var/www/symfony

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
RUN php composer-setup.php
RUN php -r "unlink('composer-setup.php');"
RUN mv composer.phar /usr/local/bin/composer


