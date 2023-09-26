FROM node:18.13.0-alpine AS builder

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.21.0-alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]



# Определение этапа сборки
FROM node:14 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Этап сборки образа с nginx
FROM nginx:1.21.0-alpine
# COPY --from=builder ../app/build /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY ../app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf