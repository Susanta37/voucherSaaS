FROM php:8.3-fpm

RUN apt-get update && apt-get install -y \
    git curl unzip zip \
    libpng-dev libonig-dev libxml2-dev \
    libzip-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# ✅ Laravel Installer
RUN composer global require laravel/installer \
    && ln -s /root/.composer/vendor/bin/laravel /usr/local/bin/laravel || true \
    && ln -s /root/.config/composer/vendor/bin/laravel /usr/local/bin/laravel || true

WORKDIR /var/www
