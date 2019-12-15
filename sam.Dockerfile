FROM bluerain/crystal:runtime-slim

RUN apt update && \
    apt install libsqlite3-0 sqlite3 -y && \
    rm -rf /var/lib/apt/lists/*  && \
    rm -rf /var/lib/apt/lists/partial/*

ARG APP_HOME=/veemoe-cloud

RUN mkdir "$APP_HOME" && \
    mkdir "$APP_HOME/db" && \
    ln -s "$APP_HOME/sam" /usr/local/bin/sam

COPY bin/sam "$APP_HOME/sam"

WORKDIR $APP_HOME

ENV VEEMOE_CLOUD_ENV=prod
ENV VEEMOE_CLOUD_DATABASE_HOST=/data
