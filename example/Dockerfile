# https://developers.home-assistant.io/docs/add-ons/configuration#add-on-dockerfile
ARG BUILD_FROM=ghcr.io/hassio-addons/base:13.1.1
FROM $BUILD_FROM

# RUN \
#     apk update && \
#     apk add -U curl bash ca-certificates openssl ncurses coreutils python3 make gcc g++ libgcc linux-headers grep util-linux binutils findutils && \
#     curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash && \
#     export NVM_DIR="$HOME/.nvm" && \
#     [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && \
#     nvm install -s lts/hydrogen \
#     && rm -f -r \
#         /tmp/*

# Set shell
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN \
    apk add --no-cache \
        nginx \
        nodejs \
        npm

ENV NODE_ENV production
    # \
    # && curl -J -L -o /tmp/bashio.tar.gz \
    #     "https://github.com/hassio-addons/bashio/archive/v0.14.3.tar.gz" \
    # && mkdir /tmp/bashio \
    # && tar zxvf \
    #     /tmp/bashio.tar.gz \
    #     --strip 1 -C /tmp/bashio \
    # \
    # && mv /tmp/bashio/lib /usr/lib/bashio \
    # && ln -s /usr/lib/bashio/bashio /usr/bin/bashio

# Copy root filesystem
COPY rootfs /

WORKDIR /usr/src

# EXPOSE 3000

RUN npm install && npm run postinstall