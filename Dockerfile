FROM node:20-bullseye

ENV NODE_ENV=production

WORKDIR /app

# System deps for native modules like better-sqlite3 (node-gyp)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 build-essential pkg-config make g++ \
 && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

CMD ["npm", "run", "start"]
