
FROM node:18
RUN fallocate -l 2G /swapfile && \
    chmod 600 /swapfile && \
    mkswap /swapfile && \
    swapon /swapfile && \
    echo "/swapfile none swap sw 0 0" >> /etc/fstab
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
ENV PORT 3000
CMD ["npm", "start"]
