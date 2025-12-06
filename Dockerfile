FROM node:20-slim

WORKDIR /app

COPY vakthund ./vakthund
COPY vakthund-engine ./engine

RUN apt-get update && apt-get install --no-install-recommends -y ca-certificates wget python3 python3-pip && rm -rf /var/lib/apt/lists/*

RUN pip install --break-system-packages --no-cache-dir -r ./engine/requirements.txt

WORKDIR /app/vakthund

RUN npm install

RUN npm run build

CMD ["npm", "start"]