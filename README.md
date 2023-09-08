# objekts-svelte

View Modhaus (tripleS & ARTMS) objekts outside the app.

## Setup

```bash
$ git clone git@github.com:teamreflex/objekts-svelte.git
$ cd objekts-svelte
$ pnpm install
$ cp .env.example .env.local # fill out env
$ pnpm db:push
$ pnpm dev
```

#### NFT Scraping

1. Install [Bun](https://bun.sh/).
2. Ensure your Upstash Redis keys are set, or else scraping cannot resume from any lost position.
3. Ensure your Alchemy key/account has enough requests to scrape both contracts.
   - Between the two contracts there are roughly 800k tokens, meaning a full scrape will take 8000 requests.
4. Execute `bun run scrape` to scrape both ARTMS and tripleS contracts.
   - This should only need to be a one time process to "seed" the database. Afterwards, the webhook ingest should take over.

#### NFT Ingest

1. Go to your [Alchemy webhooks](https://dashboard.alchemy.com/webhooks) and create a new NFT Activity webhook.
2. Set the URL to `https://yourdomain.com/api/nft-ingest`
3. Take both contract addresses from `/src/lib/server/nft.ts` and add them in here. Leave the tokenId field empty.
4. Save webhook.
5. Take the "Signing Key" and add it to your env file as `ALCHEMY_WEBHOOK_KEY`.

## Tooling

- [SvelteKit](https://kit.svelte.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn-svelte](https://www.shadcn-svelte.com/)
- [Alchemy NFT API](https://www.alchemy.com/)
- [Upstash](https://www.upstash.com/)
- [PlanetScale](https://planetscale.com/) & [Drizzle ORM](https://orm.drizzle.team/)
- [Bun](https://bun.sh/)

## License

Licensed under the [MIT license](https://github.com/teamreflex/objekts-svelte/blob/main/LICENSE.md).
