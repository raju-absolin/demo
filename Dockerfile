FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf /usr/share/nginx/html/*
COPY default.conf /etc/nginx/conf.d/default.conf
COPY dist/ .
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
