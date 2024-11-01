FROM node:lts AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

# Remove all .env* files
# RUN find . -type f -name '.env*' -delete

# By copying only the package.json and package-lock.json here, we ensure that the following `-deps` steps are independent of the source code.
# Therefore, the `-deps` steps will be skipped if only the source code changes.
COPY package.json package-lock.json ./

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base AS runtime
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build-deps /app/dist /app/dist

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

ENV NODE_ENV production
CMD node ./dist/server/entry.mjs