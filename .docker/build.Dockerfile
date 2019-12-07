FROM bluerain/crystal:0.31.1-build AS ImageMagick7

ARG MAGICK_VERSION=7.0.9-7
ARG MAGICK_DELEGATE_DEPS=libpng-dev\ libjpeg-dev\ libwebp-dev

WORKDIR /home

RUN apt-get update && \
    apt-get install wget -y && \
    apt-get install $MAGICK_DELEGATE_DEPS -y && \
    wget "https://github.com/ImageMagick/ImageMagick/archive/${MAGICK_VERSION}.tar.gz" && \
    tar xvzf "${MAGICK_VERSION}.tar.gz" && \
    cd "ImageMagick-${MAGICK_VERSION}" && \
    ./configure && \
    make


FROM bluerain/crystal:0.31.1-build

WORKDIR /home

ARG MAGICK_VERSION=7.0.9-7
ARG MAGICK_DELEGATE_DEPS=libpng-dev\ libjpeg-dev\ libwebp-dev
ARG DEPS=libsqlite3-dev\ sqlite3

COPY --from=ImageMagick7 "/home/ImageMagick-${MAGICK_VERSION}" "/home/ImageMagick-${MAGICK_VERSION}"

RUN cd "ImageMagick-${MAGICK_VERSION}" && \
    apt-get update && \
    apt-get install $MAGICK_DELEGATE_DEPS $DEPS -y && \
    make install && \
    ldconfig /usr/local/lib && \
    rm -rf "/home/ImageMagick-${MAGICK_VERSION}"
