FROM nginxinc/nginx-unprivileged:1.21.1-alpine

COPY /dist /usr/share/nginx/html
COPY /nginx-default.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
