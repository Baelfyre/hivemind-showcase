# Architecture Overview

HiveMind is organized as a set of focused product surfaces with a protected
service layer behind them.

```text
Public Website
      |
      v
User Workspace  ---->  Protected Service Layer
      |
      v
Admin Surface
      |
      v
Public Showcase
```

## Public Website

The public website presents product information, support paths, pricing context,
and legal materials. It is intended for public visitors.

## User Workspace

The workspace is the main user-facing collaboration surface. It supports
structured sessions, reusable collaboration patterns, and continuity across work.

## Admin Surface

The admin surface is separate from the public website and workspace. It is used
for operational visibility and support workflows.

## Protected Service Layer

Sensitive actions are handled by protected services. Browser-facing surfaces use
public contracts and do not own sensitive authority.

## Showcase Repository

The showcase repository contains public documentation and brand assets only. It
does not include production software, service internals, operational setup, or
private workflow materials.
