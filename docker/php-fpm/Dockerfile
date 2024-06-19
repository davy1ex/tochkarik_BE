FROM php:8.1-fpm


RUN apt-get update && apt-get install -y \
        libzip-dev \
        libicu-dev \
        libpq-dev \
        git \
        unzip \
    && docker-php-ext-install \
        pdo \
        pdo_pgsql \
        zip \
        intl \
        opcache
#    && pecl install apcu \
#    && docker-php-ext-enable apcu



ARG INSTALL_XDEBUG=false
RUN if [ ${INSTALL_XDEBUG} = true ]; \
    then \
        # Install and enable Xdebug
        pecl install xdebug && docker-php-ext-enable xdebug; \
    fi;


RUN groupadd -g 1000 www && useradd -u 1000 -ms /bin/bash -g www www

# enable posgres
RUN docker-php-ext-install pdo_pgsql

# Установка Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer



# Copy php.ini to container
COPY ./docker/php-fpm/php.ini /usr/local/etc/php/php.ini
WORKDIR /application
USER www
EXPOSE 9000

CMD ["php-fpm"]

