# https://developers.home-assistant.io/docs/add-ons/configuration#add-on-dockerfile
ARG BUILD_FROM
FROM $BUILD_FROM

RUN \
    apk update && \
    apk add -U curl bash ca-certificates openssl ncurses coreutils python3 make gcc g++ libgcc linux-headers grep util-linux binutils findutils && \
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash && \
    export NVM_DIR="$HOME/.nvm" && \
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && \
    nvm install -s lts/hydrogen \
    && rm -f -r \
        /tmp/*

WORKDIR /data

# Copy root filesystem
COPY rootfs /
