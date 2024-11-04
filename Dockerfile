FROM node:21-bullseye-slim as base

# Set for base and all layers that inherit from it
ENV NODE_ENV production

# Install all node_modules, including dev dependencies
FROM base as build

WORKDIR /myapp

ADD package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

# Add prisma files
ADD prisma ./prisma/

# Generate Prisma client
RUN yarn prisma generate

ADD . .
RUN yarn build

# Setup production node_modules
FROM base as production-deps

WORKDIR /myapp

ADD package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=true

# Add prisma as a production dependency
RUN yarn add prisma

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /myapp

COPY --from=production-deps /myapp/node_modules /myapp/node_modules

ADD package.json yarn.lock ./
ADD prisma ./prisma/

COPY --from=build /myapp/build /myapp/build
COPY --from=build /myapp/public /myapp/public
COPY --from=build /myapp/node_modules/.prisma /myapp/node_modules/.prisma

# Generate Prisma client
RUN yarn prisma generate

RUN yarn prisma migrate deploy

EXPOSE 3000

CMD ["yarn", "start"]
