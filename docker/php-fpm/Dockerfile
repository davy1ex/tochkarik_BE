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


# Additional enabling Xdebug
RUN echo "xdebug.mode=debug" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.start_with_request=yes" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.client_host=host.docker.internal" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.client_port=9003" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini


# enable posgres
RUN docker-php-ext-install pdo_pgsql

# Установка Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer



# Copy php.ini to container
#COPY ./docker/php/php.ini /usr/local/etc/php/php.ini
WORKDIR /application



COPY ./php-fpm.conf /usr/local/etc/php-fpm.conf
COPY ./www.conf /usr/local/etc/php-fpm.d/www.conf