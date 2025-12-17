# Stage 1: Install dependencies
FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

# Stage 2: Production image
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Create a new user with UID 10014
RUN addgroup -g 10014 choreo && \
    adduser --disabled-password --no-create-home --uid 10014 --ingroup choreo choreouser

USER 10014

CMD [ "node", "index.mjs" ]


