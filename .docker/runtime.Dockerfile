FROM bluerain/crystal:0.31.1-build AS ImageMagick7

ARG MAGICK_VERSION=7.0.9-6
ARG MAGICK_DELEGATE_DEPS=libpng-dev\ libjpeg-dev

WORKDIR /home

RUN apt update && \
    apt install wget -y && \
    apt install $MAGICK_DELEGATE_DEPS -y && \
    wget "https://github.com/ImageMagick/ImageMagick/archive/${MAGICK_VERSION}.tar.gz" && \
    tar xvzf "${MAGICK_VERSION}.tar.gz" && \
    cd "ImageMagick-${MAGICK_VERSION}" && \
    ./configure && \
    make


FROM bluerain/crystal:runtime-slim

ARG MAGICK_VERSION=7.0.9-6
ARG MAGICK_DELEGATE_DEPS=libpng-dev\ libjpeg-dev\ libxml2-dev
ARG BUILDING_DEPS=make\ gcc\ g++
ARG DEPS=libgomp1\ libjpeg62-turbo\ libpng16-16\ libxml2

WORKDIR /home

COPY --from=ImageMagick7 "/home/ImageMagick-${MAGICK_VERSION}" "/home/ImageMagick-${MAGICK_VERSION}"

RUN cd "ImageMagick-${MAGICK_VERSION}" && \
    apt-get update && \
    apt-get install $BUILDING_DEPS -y && \
    apt-get install $MAGICK_DELEGATE_DEPS -y && \
    make install && \
    ldconfig /usr/local/lib && \
    apt-get purge $MAGICK_DELEGATE_DEPS $BUILDING_DEPS -y && \
    apt-get install $DEPS -y && \
    apt-get autoremove -y && \
    rm -rf "/home/ImageMagick-${MAGICK_VERSION}" && \
    rm -rf /var/lib/apt/lists/*  && \
    rm -rf /var/lib/apt/lists/partial/*