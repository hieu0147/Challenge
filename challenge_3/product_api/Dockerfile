# Sử dụng Node.js LTS version làm base image
FROM node:20-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ source code
COPY . .

# Expose port
EXPOSE 3000

# Command để chạy ứng dụng
CMD ["npm", "start"] 