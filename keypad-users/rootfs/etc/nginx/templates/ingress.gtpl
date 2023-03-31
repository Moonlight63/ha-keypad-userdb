server {
    listen {{ .interface }}:{{ .port }} default_server;

    include /etc/nginx/includes/server_params.conf;
    include /etc/nginx/includes/proxy_params.conf;

    #rewrite ^/$ {{ .entry }}/$1 permanent;

    location / {
        allow   172.30.32.2;
        deny    all;

        proxy_set_header X-External-Path {{ .entry }};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_pass http://backend{{ .entry }}$uri$is_args$args;

        #proxy_redirect '/' $http_x_ingress_path/;

        #sub_filter_once off;
        #sub_filter '/_nuxt/' '{{ .entry }}/_nuxt/';

    }

    #location /hassio/ingress/ {
    #    rewrite ^/hassio/ingress/(.*)$ /$1 break;
    #    proxy_set_header X-External-Path {{ .entry }};
    #    proxy_http_version 1.1;
    #    proxy_set_header Upgrade $http_upgrade;
    #    proxy_set_header Connection $connection_upgrade;
    #    proxy_pass http://backend$uri$is_args$args;

        #HASSIO_INGRESS_URL
        #rewrite ^ $request_uri;
        #rewrite '^/hassio/ingress(/.*)$' $1 break;
        #proxy_set_header X-External-Path /hassio/ingress;
        #proxy_http_version 1.1;
        #proxy_pass http://backend$uri;
    #}
}
