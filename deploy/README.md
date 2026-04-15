# Deployment

## Local docker-compose

```bash
docker compose up -d --build
# → http://localhost:3000
```

Volume `todo-data` persists `/data/app.db` across restarts.

## Production: Portainer Stack

The recommended deployment for self-hosted is via Portainer Stacks.

### 1. Image availability

The `main` branch is auto-built and pushed to GHCR by `.github/workflows/docker.yml`:

- `ghcr.io/muszkin/todo-nextjs:latest` (main branch, amd64)
- `ghcr.io/muszkin/todo-nextjs:main`
- `ghcr.io/muszkin/todo-nextjs:sha-<short>` (per-commit)
- `ghcr.io/muszkin/todo-nextjs:vX.Y.Z` (on semver tags)

Package page: https://github.com/users/muszkin/packages/container/package/todo-nextjs

No manual build needed — just reference the image in your stack.

If you need a custom tag or multi-arch (arm64 for Raspberry Pi), run locally:

```bash
docker buildx create --use
docker buildx build --platform linux/amd64,linux/arm64 \
  -t ghcr.io/muszkin/todo-nextjs:arm64 --push .
```

### 2. Create the stack in Portainer

1. **Stacks → Add stack**
2. Name: `todo-next-js`
3. Build method: **Web editor** — paste contents of [`portainer-stack.yml`](./portainer-stack.yml)
4. Scroll to **Environment variables** and add:

   | Name        | Value                                  |
   |-------------|----------------------------------------|
   | `IMAGE`     | `ghcr.io/muszkin/todo-nextjs:latest`   |
   | `HOST_PORT` | `3000` (or your preferred host port)   |
   | `TZ`        | `Europe/Warsaw` (or your timezone)     |

5. Click **Deploy the stack**

### 3. Verify

- Container should reach `running (healthy)` within ~40s (healthcheck calls `/api/tasks`)
- Open `http://<portainer-host>:<HOST_PORT>` — you should see the Todo dark UI
- The `todo-data` volume holds `app.db` — backup it via Portainer **Volumes → todo-next-js_todo-data → Browse**

### 4. Updates

After pushing a new image tag:

1. **Stacks → todo-next-js → Editor** (no edit needed)
2. **Update the stack** → check **Re-pull image and redeploy**
3. Container restarts; data in `todo-data` volume persists

### 5. Reverse proxy (optional)

Uncomment the Traefik labels in `portainer-stack.yml` and adjust:

- `Host(...)` to your domain
- `certresolver` to your configured Let's Encrypt resolver

If you use a different proxy (Caddy, Nginx Proxy Manager), point it to `todo-next-js:3000` on the same Docker network.

### 6. Backup / restore

The entire app state lives in `/data/app.db` inside the container. Use the export endpoint for application-level dumps:

```bash
curl http://<host>:<port>/api/export > backup-$(date +%F).json
```

Or for raw SQLite backup, copy the file from the volume:

```bash
docker exec todo-next-js sqlite3 /data/app.db ".backup '/data/backup.sqlite'"
docker cp todo-next-js:/data/backup.sqlite ./
```
