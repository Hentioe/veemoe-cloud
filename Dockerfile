FROM bluerain/veemoe-cloud:runtime

ARG APP_HOME=/home/veemoe_cloud

RUN mkdir "$APP_HOME" && \
    ln -s "$APP_HOME/veemoe_cloud" /usr/local/bin/veemoe_cloud && \
    mkdir /_source /_cache /data

COPY bin $APP_HOME
COPY static "$APP_HOME/static"

WORKDIR $APP_HOME

EXPOSE 8080

ENV VEEMOE_CLOUD_ENV=prod
ENV VEEMOE_CLOUD_SOURCE_PATH=/_source
ENV VEEMOE_CLOUD_CACHE_PATH=/_cache
ENV VEEMOE_CLOUD_DATABASE_HOST=/data

VOLUME [$VEEMOE_CLOUD_CACHE_PATH, $VEEMOE_CLOUD_DATABASE_HOST]

ENTRYPOINT veemoe_cloud --prod port=8080
