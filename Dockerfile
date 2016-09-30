FROM nginx

ADD  nginx.conf /etc/nginx/conf.d/default.conf
COPY /build/public /usr/share/nginx/html