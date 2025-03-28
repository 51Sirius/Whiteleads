FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install @tabler/icons-react react-router-dom axios bootstrap @popperjs/core --save

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
