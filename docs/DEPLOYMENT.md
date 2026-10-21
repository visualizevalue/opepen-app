# Production deployment

The Nuxt application runs on Hetzner server `122996717` (`5.78.66.101`) using
Kamal 2.11, under service `opepen-app`. The API deploys separately from
`visualizevalue/opepen-api`; its deployment guide also covers the database,
cron jobs, backups, and the October 2026 Cleavr migration.

Install the Ruby version in `.ruby-version` and the gems with `bundle install`.
Docker and root SSH access to the deployment host are required. The ignored
`.env.production` supplies runtime settings and registry credentials.

```sh
./scripts/deploy deploy
./scripts/deploy app details
./scripts/deploy app logs
```

With mise, commands can be prefixed by `mise exec ruby@4.0.6 --`.

Docker builds the locked pnpm dependencies and a clean Nuxt `node-server` output.
The runtime only contains `.output` and listens on port 3000 inside the private
Docker network. Public API, OAuth, RPC and wallet settings come from the existing
production environment. The Gemini key stays in the server environment.

Kamal routes `opepen.art` and redirects `www.opepen.art` to the canonical domain,
with automatic HTTPS for both. Existing unexpired certificates
were securely seeded into the proxy's ACME cache to allow direct HTTPS checks
before DNS changes. Renewal is automatic after DNS points to the new server.

Set `opepen.art`, `api.opepen.art`, and `metadata.opepen.art` A records to
`5.78.66.101` for the cutover. The old Cleavr Nginx forwards to the new server
while DNS propagates; its application processes and jobs are stopped.
Keep the old server until public DNS and behavior have been verified.

```sh
curl --resolve opepen.art:443:5.78.66.101 https://opepen.art/sets
```

Credentials, certificates, private backups and migration logs are ignored under
`.env.production` and `.local/`. Keep them private and out of Git.
