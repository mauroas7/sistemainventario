# Usamos una imagen oficial de PHP con Apache
FROM php:8.2-apache

# Instalamos dependencias del sistema y Node.js (necesario para compilar React)
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Instalamos las extensiones de PHP necesarias para Laravel y MySQL
RUN docker-php-ext-install pdo pdo_mysql gd zip

# Habilitamos el módulo rewrite de Apache (vital para las rutas de Laravel)
RUN a2enmod rewrite

# Apuntamos el servidor de Apache a la carpeta "public" de Laravel
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Instalamos Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Definimos el directorio de trabajo
WORKDIR /var/www/html

# Copiamos todos los archivos del proyecto al servidor
COPY . .

# Instalamos dependencias de PHP (sin las de desarrollo)
RUN composer install --optimize-autoloader --no-dev

# Instalamos dependencias de NPM y compilamos React (Inertia)
RUN npm install
RUN npm run build

# Damos permisos de escritura a Laravel para sus logs y caché
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache