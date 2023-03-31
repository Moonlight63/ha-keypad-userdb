server {
    listen {{ .interface }}:{{ .port }} default_server;

    include /etc/nginx/includes/proxy_params.conf;

    location / {
        absolute_redirect off;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Origin "";
        proxy_pass http://backend;
        proxy_redirect '/' $http_x_ingress_path/;
        sub_filter 'href="/' 'href="$http_x_ingress_path/';
        sub_filter '<script src="/' '<script src="$http_x_ingress_path/';
        sub_filter "top.location.href='" "top.location.href='$http_x_ingress_path";

        sub_filter_once off;
    }
}