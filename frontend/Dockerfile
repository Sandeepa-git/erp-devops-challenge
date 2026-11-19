FROM nginx:1.25-alpine

# Set working directory to Nginx html root
WORKDIR /usr/share/nginx/html

# Clean default nginx public files and copy only required frontend assets
RUN rm -rf ./*
COPY index.html ./index.html

# ==============================================================================
# TODO [Task 1 & 4 - Reliability]:
# Implement a container-level HEALTHCHECK instruction to verify that
# Nginx is serving the frontend web application (http://127.0.0.1/).
# ==============================================================================

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
