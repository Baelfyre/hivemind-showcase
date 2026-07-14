# HiveMind Showcase

HiveMind is a structured AI collaboration platform for research, writing,
coding, and analysis workflows.

This repository is a public, deployable project showcase and documentation
website for HiveMind. It contains a static frontend alongside the existing
public documentation and brand assets.

## Overview

HiveMind is designed around guided collaboration. The product helps people move
from a goal to a structured working session using reusable collaboration
patterns, focused workspace flows, and clear separation between public,
workspace, administrative, and service responsibilities.

The showcase describes the product concept, architecture, feature direction,
security posture, privacy posture, and roadmap at a high level.

## Highlights

- Preset-driven collaboration for repeatable work patterns.
- Multi-model workflow concept without exposing protected operating details.
- Future support for hosted and locally integrated AI models.
- Guided reasoning patterns that keep the user in control.
- Separate public, workspace, admin, and service surfaces.
- Deployable public showcase for review and portfolio context.

## Repository Boundary

This repository may contain:

- Public project explanations and architecture overviews.
- Public-facing diagrams and screenshots using synthetic data.
- Demonstration videos, project status, roadmap, and FAQ information.
- Legal and privacy pages.
- Static frontend implementation and public brand assets.

This repository must not contain:

- Production HiveMind application code.
- Server-side business logic or operational API implementations.
- API credentials, infrastructure secrets, or private prompts and user data.
- Operational database schemas containing sensitive implementation details.
- Protected governance internals.
- Private analytics or account data.

## Repository Map

- `hivemind-main-web`: public website surface.
- `hivemind-workspace`: user workspace surface.
- `hivemind-admin`: restricted administrative surface.
- `hivemind-api`: protected service authority.
- `hivemind-showcase`: public documentation and brand showcase.

## Public Docs

- [Project Overview](PROJECT_OVERVIEW.md)
- [Features](FEATURES.md)
- [Architecture Overview](ARCHITECTURE_OVERVIEW.md)
- [Security Overview](SECURITY_OVERVIEW.md)
- [Privacy Overview](PRIVACY_OVERVIEW.md)
- [Roadmap](ROADMAP.md)
- [Contact](CONTACT.md)

## Brand Assets

Public brand assets are stored in `assets/`.

## Local Development

```powershell
npm.cmd ci
npm.cmd run dev
```

Create a production build with `npm.cmd run build`. No environment file is
required.

## License and Notice

HiveMind showcase materials are proprietary. See [LICENSE.md](LICENSE.md) and
[NOTICE.md](NOTICE.md).
