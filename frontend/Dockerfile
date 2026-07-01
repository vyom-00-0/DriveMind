FROM node:20-alpine

WORKDIR /app

# Copy dependency specifications
COPY package*.json ./

# Install dependencies (including devDependencies required for Vite)
RUN npm install

# Copy application source
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start Vite dev server in host-exposure mode
CMD ["npm", "run", "dev", "--", "--host"]
