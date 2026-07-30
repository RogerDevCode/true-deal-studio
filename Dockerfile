FROM nginx:1.28.0-alpine

COPY infra/docker/nginx.conf /etc/nginx/nginx.conf
COPY --chown=nginx:nginx . /usr/share/nginx/html

USER nginx
EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=3s --retries=3 --start-period=5s \
  CMD wget -qO- http://127.0.0.1:8080/health >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
