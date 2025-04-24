FROM node:20 AS builder

WORKDIR /app

COPY . . 

RUN npm install
RUN npm run build

FROM nginx:alpine

# 빌드된 파일 복사
COPY --from=builder /app/dist /usr/share/nginx/html/.

# RUN rm /etc/nginx/conf.d/default.conf

# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]