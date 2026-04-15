# Deployment

## Local docker-compose

```bash
docker compose up -d --build
# → http://localhost:3000
```

Volume `todo-data` persists `/data/app.db` across restarts.

## Production: Portainer Stack

The recommended deployment for self-hosted is via Portainer Stacks.

### 1. Build and push the image

Portainer cannot build from a local checkout — it pulls from a registry. Build locally and push to a registry your Portainer host can reach:

```bash
# Docker Hub
docker build -t <user>/todo-next-js:latest .
docker push <user>/todo-next-js:latest

# or GitHub Container Registry
docker build -t ghcr.io/<user>/todo-next-js:latest .
docker push ghcr.io/<user>/todo-next-js:latest
```

For multi-arch (e.g. amd64 + arm64 for a Pi):

```bash
docker buildx create --use
docker buildx build --platform linux/amd64,linux/arm64 \
  -t ghcr.io/<user>/todo-next-js:latest --push .
```

### 2. Create the stack in Portainer

1. **Stacks → Add stack**
2. Name: `todo-next-js`
3. Build method: **Web editor** — paste contents of [`portainer-stack.yml`](./portainer-stack.yml)
4. Scroll to **Environment variables** and add:

   | Name        | Value                                  |
   |-------------|----------------------------------------|
   | `IMAGE`     | `ghcr.io/<user>/todo-next-js:latest`   |
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
