ARG REGISTRY_URL=723464704088.dkr.ecr.us-east-1.amazonaws.com
FROM ${REGISTRY_URL}/apptile-analytics-manager-v2-base:latest

ARG SERVER_PORT=3000
ENV SERVER_PORT=${SERVER_PORT}

COPY package*.json ./
RUN npm i --no-audit
COPY ./ ./
RUN npm run build

USER node
EXPOSE ${SERVER_PORT}

CMD pm2-runtime process.yaml
