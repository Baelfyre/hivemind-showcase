# Showcase Cloudflare Pages Deployment Runbook

## Purpose

Deploy `Baelfyre/hivemind-showcase` as a separate static Cloudflare Pages
project, validate its `pages.dev` deployment, then move the public custom
domain from the old Pages project with rollback evidence intact.

This runbook does not authorize changes to HiveMind application runtime,
databases, authentication, APIs, or the old Pages project beyond removing and,
if rollback is required, restoring its custom-domain association.

## Release gates

Do not create or change Cloudflare resources until all gates pass:

- SH-3A is approved and merged into `main`.
- `Validate showcase` succeeds on the merged `main` commit.
- local `main` is clean and synchronized with `origin/main`.
- intended production commit SHA is recorded.
- correct non-secret Cloudflare account label is confirmed.
- Cloudflare GitHub App can select `Baelfyre/hivemind-showcase`.

Stop when any gate cannot be proven.

## Pages project configuration

Create a new project through **Workers & Pages > Create application > Pages >
Connect to Git**. Do not reconnect the old `HiveMind_1.0` project.

| Setting | Value |
| --- | --- |
| Repository | `Baelfyre/hivemind-showcase` |
| Project name | `hivemind-showcase` |
| Production branch | `main` |
| Framework preset | Vite, or None with the settings below |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |
| Environment variables | None |

Before deployment, confirm no D1, KV, R2, Durable Object, service binding,
secret, Pages Function, or privileged deployment hook is configured.

Select **Save and Deploy** only after those checks pass.

## Initial deployment evidence

Record outside source control unless a separately approved evidence location
is provided. Never record tokens, account IDs, API keys, or credentials.

```text
Cloudflare account: <non-secret account label>
Pages project: hivemind-showcase
Production deployment ID: <deployment identifier>
Git commit: <exact SHA>
Production branch: main
pages.dev URL: <URL>
Deployment status: Success
```

## Validate `pages.dev`

Run:

```powershell
curl.exe -I https://<project>.pages.dev/
```

Require HTTP 200 and valid HTTPS. In a browser, verify:

- desktop and mobile layouts;
- 200 percent zoom;
- keyboard navigation and visible focus;
- reduced-motion behavior and orbital animation;
- approved logo and every public link;
- no console errors or failed requests;
- no HiveMind application API, database, or authentication request.

Confirm Cloudflare's production deployment commit equals the intended `main`
commit. Stop on any mismatch or failed check.

Success gate:

```text
SHOWCASE_PAGES_DEPLOYMENT_VALIDATED
```

## Capture rollback evidence

Before moving the custom domain, record:

```text
Old Pages project name: <name>
Old pages.dev URL: <URL>
Public custom domain: <domain>
Current custom-domain status: Active
Current DNS record: <type, name, target only>
Old production deployment: <deployment identifier or commit>
```

Capture screenshots of the old custom-domain association, current DNS record,
old production deployment, and new showcase production deployment.

## Move the custom domain

Use Cloudflare Pages custom-domain controls. A manual CNAME change alone is
not sufficient.

1. Remove the public custom domain from the old Pages project.
2. Inspect the old Pages-specific DNS record and remove or update it when
   required.
3. Open `hivemind-showcase` and select **Custom domains > Set up a domain**.
4. Enter the public custom domain.
5. Allow Cloudflare to create or update the required DNS record.
6. Wait for active custom-domain status and active TLS certificate.

Do not delete the old Pages project. Keep its `pages.dev` deployment as the
rollback target.

## Validate the public domain

Run:

```powershell
curl.exe -I https://<public-domain>/
Resolve-DnsName <public-domain>
```

Validate in normal and private browser sessions, a mobile network or second
internet connection, and at least one external DNS resolver. Require:

- HTTP 200 and valid TLS;
- showcase maintenance page and approved assets;
- no stale old application bundle;
- no console errors or operational API requests;
- old Pages project no longer lists the custom domain.

## Rollback

Rollback immediately when domain activation or TLS fails, HTTP returns 404,
522, or another failure, assets or the maintenance page fail, the wrong
deployment is served, DNS remains inconsistent after a reasonable propagation
window, or the old project remains the custom-domain owner.

1. Remove the domain from `hivemind-showcase`.
2. Restore the prior DNS record.
3. Reattach the domain to the old Pages project.
4. Validate the old maintenance deployment.
5. Record failed-cutover evidence without secrets.
6. Leave the main-repository maintenance runtime untouched.

## Completion evidence

```text
Phase: SH-3B Showcase Pages Deployment and Domain Cutover
Showcase repository: Baelfyre/hivemind-showcase
Showcase commit: <exact production commit>
Cloudflare Pages project: <project name>
Production deployment: <deployment ID>
pages.dev URL: <URL>
pages.dev validation: <results>
Public domain: <domain>
Old Pages project: <project name>
Old custom-domain association: Removed
DNS: Updated and active
Public-domain validation: <results>
Rollback target: <old pages.dev URL>

Verdict:
SHOWCASE_DOMAIN_CUTOVER_COMPLETE
OLD_PUBLIC_DEPLOYMENT_ISOLATED
READY_TO_RESUME_SH-3D
```
