FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Make wait script executable
RUN chmod +x wait-for-it.sh

EXPOSE 5000

CMD ["node", "server.js"]