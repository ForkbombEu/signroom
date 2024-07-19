# SPDX-FileCopyrightText: 2024 The Forkbomb Company
#
# SPDX-License-Identifier: AGPL-3.0-or-later

FROM node:lts-alpine AS builder

RUN apk add --no-cache libc6-compat git
RUN wget "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" -O /bin/pnpm && \
    chmod +x /bin/pnpm

WORKDIR /build

COPY ./webapp/ .
RUN rm -rf zenflows-crypto
RUN rm -rf client_zencode
RUN git init
RUN git submodule add -f https://github.com/interfacerproject/zenflows-crypto zenflows-crypto
RUN git submodule add -f https://github.com/ForkbombEu/client_zencode client_zencode

EXPOSE $NODE_PORT
RUN pnpm i
CMD pnpm serve
