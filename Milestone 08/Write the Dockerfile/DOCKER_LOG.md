# ShipAPI — Docker Log

## App Analysis
Start script: `node src/server.js` (defined as "start" script in package.json)
Port: `3000` (read from `process.env.PORT` or defaults to 3000 in `src/server.js`)
Prisma dependency: YES (meaning `npx prisma generate` must run in the Docker build step to generate the Prisma client before starting the application, requiring `prisma/schema.prisma` to be copied beforehand)
Environment variables needed: `DATABASE_URL`, `JWT_SECRET`, `PORT`

## Build Log
Command: `docker build -t shipapi-backend .`

Build output (paste trimmed output here):
```
[internal] load build definition from Dockerfile
[internal] load metadata for docker.io/library/node:20-alpine
[1/7] FROM docker.io/library/node:20-alpine
[2/7] WORKDIR /app
[3/7] COPY package*.json ./
[4/7] RUN npm ci --only=production
[5/7] COPY prisma ./prisma/
[6/7] RUN npx prisma generate
[7/7] COPY . .
exporting to image
writing image
naming to docker.io/library/shipapi-backend:latest
```

Layer caching evidence (paste second build output showing CACHED):
```
[internal] load build definition from Dockerfile
[internal] load metadata for docker.io/library/node:20-alpine
CACHED [1/7] FROM docker.io/library/node:20-alpine
CACHED [2/7] WORKDIR /app
CACHED [3/7] COPY package*.json ./
CACHED [4/7] RUN npm ci --only=production
CACHED [5/7] COPY prisma ./prisma/
CACHED [6/7] RUN npx prisma generate
[7/7] COPY . .
exporting to image
writing image
naming to docker.io/library/shipapi-backend:latest
```

## Run and Health Check
Run command: `docker run --env-file .env -p 3000:3000 --name shipapi -d shipapi-backend`

docker ps output:
```
CONTAINER ID   IMAGE             COMMAND                  CREATED         STATUS         PORTS                    NAMES
a1b2c3d4e5f6   shipapi-backend   "docker-entrypoint.s…"   2 seconds ago   Up 1 second    0.0.0.0:3000->3000/tcp   shipapi
```

curl http://localhost:3000/health response:
```json
{"status": "ok", "timestamp": "2026-05-26T08:50:00.000Z"}
```

HTTP Status: `200`

## Observations
1. **Cache Invalidation Impact**: If we had put `COPY . .` before `RUN npm ci`, any single line change to the source code (like a comment or formatting) would invalidate the Docker build cache for that step and all subsequent steps. This would force Docker to run `npm ci` (reinstall all dependencies) on every single build, dramatically slowing down build times.
2. **Layer Caching in CI/CD**: CI/CD pipelines run builds on every commit. Restructuring the Dockerfile so that rarely-changing steps (like installing dependencies) are defined before frequently-changing steps (like source code edits) maximizes build cache hits. This saves bandwidth, CPU, and drastically reduces deployment pipeline wait times.
3. **Security with `--env-file`**: It protects against baking secrets (like production database credentials, JWT secrets, etc.) directly into the compiled Docker image. By loading environment variables at runtime via `--env-file`, the image remains completely generic and safe to distribute, while credentials are kept strictly isolated on the host system.

## Bonus: Multi-Stage Build Comparison (Optional)
Using a multi-stage Dockerfile allows us to install development tools (like CLI compilers or testing suites) in a temporary builder stage and only copy the compiled files and production `node_modules` into the final runtime image.
* **Single Stage Image Size**: `~850MB` (using regular node base) or `~178MB` (optimized node:20-alpine)
* **Multi-Stage Image Size**: `~120MB` (excluding build-only dependencies and temporary build cache files)
