FROM node:14.15.5-alpine as runner

RUN npm install -g npm@7

RUN mkdir -p /home/node/src/mmk-dsa/
RUN mkdir -p /home/node/src/mmk-dsa/node_modules
RUN mkdir -p /home/node/src/mmk-dsa/build

WORKDIR /home/node/src/mmk-dsa/

COPY package.json package-lock.json ./

RUN npm install --no-audit --quiet

COPY . .

ARG REACT_APP_API
ENV REACT_APP_API ${REACT_APP_API}

ARG REACT_APP_FILE_SIZE_MAX
ENV REACT_APP_FILE_SIZE_MAX ${REACT_APP_FILE_SIZE_MAX}

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
