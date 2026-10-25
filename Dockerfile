# SPDX-License-Identifier: GPL-2.0-or-later

# Stage 1: install dependencies and build the static site.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: serve only the build output, as a non-root user (nginx listens on 8080).
FROM nginxinc/nginx-unprivileged:alpine
# The GPL asks for source to accompany every distribution; this points to it.
LABEL org.opencontainers.image.title="Collage Creator" \
      org.opencontainers.image.description="Browser-only photo collage maker, a modified web version of PhotoCollage" \
      org.opencontainers.image.source="https://github.com/briggsyj/PhotoCollage" \
      org.opencontainers.image.licenses="GPL-2.0-or-later" \
      org.opencontainers.image.url="https://github.com/briggsyj/PhotoCollage"
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY security-headers.conf /etc/nginx/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:8080/ || exit 1
