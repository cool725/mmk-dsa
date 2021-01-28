FROM node:12.16.2-alpine as runner

RUN mkdir -p /home/node/src/mmk-dsa/
RUN mkdir -p /home/node/src/mmk-dsa/node_modules
RUN mkdir -p /home/node/src/mmk-dsa/build

WORKDIR /home/node/src/mmk-dsa/

COPY package.json package-lock.json ./

RUN npm install --no-audit --quiet

COPY . .

ARG REACT_APP_API
ENV REACT_APP_API ${REACT_APP_API}

FROM runner as builder

RUN npm run build

ARG BUILD_VERSION=local
RUN echo ${BUILD_VERSION} >> /home/node/src/mmk-dsa/build/version.txt

# https://jira.atlassian.com/browse/BCLOUD-17241
# Due to the way bitbucket and docker work, we have to copy files as root
RUN chown -R root:root /home/node/src/mmk-dsa/build

VOLUME /home/node/src/mmk-dsa/node_modules
VOLUME /home/node/src/mmk-dsa/build

FROM alpine:3.11 as publish
RUN mkdir -p /home/node/src/mmk-dsa/build
WORKDIR /home/node/src/mmk-dsa/build
COPY --chown=root:root --from=builder /home/node/src/mmk-dsa/build .
VOLUME /home/node/src/mmk-dsa/build
