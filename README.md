# Opepen App

This is the frontend (web app) of the Opepen.art site.

The Opepen project consists of three code repositories:

1. [A Metadata Service](https://github.com/visualizevalue/opepens-metadata-api)
2. [An API + database powering the site](https://github.com/visualizevalue/opepen-api)
3. This web application interacting with the above

Forks and pull requests are welcome!

## Create with an agent

Read the [Opepen creator directive](public/agents.md) to understand the project, create a
complete set, or contribute artwork to an open set. It covers the silhouette, print and
dynamic editions, collector consensus, file requirements, and the submission workflow.

The app serves this guide at `/agents.md` and a discovery index at `/llms.txt`. After deploying
these files, anyone can give an agent this prompt:

> Read https://opepen.art/agents.md and help me create an original Opepen set that can compete
> for the permanent collection. Research existing sets, develop and refine the artwork, and
> deliver a complete submission package. Prepare a draft for my review before publishing.

Agents working in this repository start at [AGENTS.md](AGENTS.md). Creating artwork does not
require installing the app.

## Setup

Make sure to install the dependencies:

```bash
yarn
```

## Development Server

Start the development server on `http://localhost:3000`

```bash
yarn dev
```

---

Based on [Nuxt 3](https://nuxt.com/docs/getting-started/introduction).
