FROM nginx:1.25-alpine

# Set working directory to Nginx html root
WORKDIR /usr/share/nginx/html

# Clean default nginx public files and copy only required frontend assets
RUN rm -rf ./*
COPY index.html ./index.html

# Security & verification health check
HEALTHCHECK --interval=15s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
