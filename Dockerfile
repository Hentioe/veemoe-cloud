FROM bluerain/veemoe-cloud:runtime


ARG APP_HOME=/home/veemoe_storage


RUN mkdir "$APP_HOME" && \
    ln -s "$APP_HOME/veemoe_storage" /usr/local/bin/veemoe_storage && \
    mkdir /_res && \
    mkdir /_cache


COPY bin $APP_HOME
COPY static "$APP_HOME/static"


WORKDIR $APP_HOME


VOLUME ["/_cache"]


EXPOSE 8080


ENV VEEMOE_STORAGE_ENV=prod


ENTRYPOINT veemoe_storage --prod res_path=/_res cache_path=/_cache port=8080
