FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ENV NODE_ENV=production
ENV PORT=5001

EXPOSE 5001

# Start the server
CMD ["node", "src/index.js"]
