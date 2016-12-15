FROM nginx

ADD  nginx.conf /etc/nginx/conf.d/default.conf

COPY /build/webapp /usr/share/nginx/html
COPY /consul /consul
COPY run.sh /run.sh

RUN chmod +x run.sh \
  && apt-get update \
  && apt-get install -y curl \
  && curl -sL https://deb.nodesource.com/setup_6.x | bash - \
  && apt-get install -y nodejs \
  && mv consul/package.json package.json \
  && npm install

CMD ./run.sh
