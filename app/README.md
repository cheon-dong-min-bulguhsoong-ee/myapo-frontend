This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

This project uses **Bun only** for local development and scripts. Do not use `npm`, `yarn`, or `pnpm` for this app.

Install dependencies and run the development server:

```bash
bun install
bun dev
```

Common commands:

```bash
bun run lint
bun run build
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Docker

Build and run the production app with Bun:

```bash
docker build \
  --build-arg NEXT_PUBLIC_WEB3AUTH_CLIENT_ID="$NEXT_PUBLIC_WEB3AUTH_CLIENT_ID" \
  --build-arg NEXT_PUBLIC_WEB3AUTH_NETWORK="${NEXT_PUBLIC_WEB3AUTH_NETWORK:-sapphire_devnet}" \
  --build-arg NEXT_PUBLIC_MYAPO_API_BASE_URL="${NEXT_PUBLIC_MYAPO_API_BASE_URL:-https://api.myapo.xyz}" \
  -t myapo-frontend ./app
docker run --rm -p 10000:10000 myapo-frontend
```

`NEXT_PUBLIC_*` values are inlined into the browser bundle during `next build`, so they must be present when the Docker image is built. Setting them only on `docker run` is too late for Web3Auth.

## GitHub Actions Deployment

Pushes to `main` automatically build the Docker image and restart the app container on the self-hosted runner server.

Server requirements:

- GitHub Actions self-hosted runner registered for this repository
- Docker installed
- Runner user can run `docker` without an interactive password
- Inbound port `10000` is open
- Repository secret `NEXT_PUBLIC_WEB3AUTH_CLIENT_ID` is set
- Optional repository variables: `NEXT_PUBLIC_WEB3AUTH_NETWORK`, `NEXT_PUBLIC_MYAPO_API_BASE_URL`

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
