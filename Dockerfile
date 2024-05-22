# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app/dzulfiqar-betest

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port on which your app runs
EXPOSE 1337

# Define environment variables
ENV MONGO_SERVER=mongodb://mongodb:27017/db_dzulfiqar_betest?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.5
ENV REDIS_SERVER=redis
ENV ACCESS_TOKEN_KEY=e4eef8adf135cb98d98893342fd8d76d5ea819c2f5073aca3580f55a5f30c8d9acd2bb7f64ea92d35538ad4296799c4baaf6bf1c45b6c39e2034fd86ea19efd9
ENV REFRESH_TOKEN_KEY=b1d3967b973929d0174cfb5d3b7fe16315bb488ed85d7016cc556cebce41b80120754fd3d3e56319117a4b5500b7897085ee7e11217d6a4c960214027882668b
ENV PORT=1337

# Start the Node.js application
CMD ["node", "index.js"]
