# Node.js base image
FROM node:18

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

EXPOSE 3000

# Run the development server
CMD ["npm", "run", "dev"]
