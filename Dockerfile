FROM nginx:1.28.0-alpine

ARG VOICE_WIDGET_ORIGIN=https://voice.stax.ink

COPY infra/docker/nginx.conf /etc/nginx/nginx.conf
COPY --chown=nginx:nginx . /usr/share/nginx/html
RUN find /usr/share/nginx/html -name '*.html' -exec \
    sed -i "s|https://voice.stax.ink|${VOICE_WIDGET_ORIGIN}|g" {} +

USER nginx
EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=3s --retries=3 --start-period=5s \
  CMD wget -qO- http://127.0.0.1:8080/health >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
