ARG BUILD_FROM=ghcr.io/hassio-addons/base:13.1.2
# hadolint ignore=DL3006
FROM ${BUILD_FROM}

ARG BUILD_ARCH=amd64

# Set shell
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Setup base
# hadolint ignore=DL3003,SC2155
RUN \
    apk add --no-cache \
        icu-data-full=72.1-r1 \
        nginx=1.22.1-r0 \
        nodejs=18.14.2-r0 \
        npm=9.1.2-r0 \
    \
    && rm -fr \
        /etc/nginx \
        /root/.cache \
        /root/.npm \
        /root/.nrpmrc \
        /tmp/* \
    \
    && npm install -g nuxi

 # Copy root filesystem
COPY rootfs /

# Make files executable
# RUN find /etc/s6-overlay/s6-rc.d/ -type f -iname "up" -exec chmod +x {} \;
RUN find /etc/s6-overlay/s6-rc.d/ -type f \( -iname "run" -o -iname "finish" \) -exec chmod +x {} \;

RUN rm -rf /opt/app/node_modules
RUN rm -rf /opt/app/*.log*
RUN rm -rf /opt/app/.nuxt
RUN rm -rf /opt/app/.nitro
RUN rm -rf /opt/app/.cache
RUN rm -rf /opt/app/.output
RUN rm -rf /opt/app/.env
RUN rm -rf /opt/app/dist
RUN rm -rf /opt/app/dev.db

# Set the port you want the app to serve on. This is not the public port
ENV NITRO_PORT=35156
ENV DATABASE_URL=file:/share/keypad_users.db

# Health check
HEALTHCHECK CMD curl --fail http://127.0.0.1:35156 || exit 1

# Build arguments
ARG BUILD_ARCH
ARG BUILD_DATE
ARG BUILD_DESCRIPTION
ARG BUILD_NAME
ARG BUILD_REF
ARG BUILD_REPOSITORY
ARG BUILD_VERSION

# Labels
LABEL \
    io.hass.name="${BUILD_NAME}" \
    io.hass.description="${BUILD_DESCRIPTION}" \
    io.hass.arch="${BUILD_ARCH}" \
    io.hass.type="addon" \
    io.hass.version=${BUILD_VERSION} \
    maintainer="Dalen Catt <dalencattmlsp@gmail.com>" \
    org.opencontainers.image.title="${BUILD_NAME}" \
    org.opencontainers.image.description="${BUILD_DESCRIPTION}" \
    org.opencontainers.image.vendor="Home Assistant Local Add-ons" \
    org.opencontainers.image.authors="Dalen Catt <dalencattmlsp@gmail.com>" \
    org.opencontainers.image.licenses="MIT" \
    org.opencontainers.image.url="https://github.com/${BUILD_REPOSITORY}" \
    org.opencontainers.image.source="https://github.com/${BUILD_REPOSITORY}" \
    org.opencontainers.image.documentation="https://github.com/${BUILD_REPOSITORY}/blob/main/README.md" \
    org.opencontainers.image.created=${BUILD_DATE} \
    org.opencontainers.image.revision=${BUILD_REF} \
    org.opencontainers.image.version=${BUILD_VERSION}
