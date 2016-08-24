FROM anapsix/alpine-java:jdk8

WORKDIR /root
RUN apk update && \
  apk add bash && \
  apk add nodejs && \
  apk add py-pip && \
  pip install --upgrade pip && \
  pip install transifex-client && \
  npm install -g grunt-cli

WORKDIR /app
VOLUME ["/app"]

EXPOSE 9000
CMD npm install &&  bash