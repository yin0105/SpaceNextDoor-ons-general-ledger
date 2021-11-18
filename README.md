
# OneSpace Ledger Service

Finance needs to keep accounting books up to date while system generates transactions.

## Getting Started

We need to integrate an open source double entry accounting system and record transactions as they happen. The ledger should be independent for each company registered in our system. Therefore when a new company is created we should automatically provision a new ledger. 
See more about [General Ledger](https://coda.io/d/One-Space-Roadmap_ddXi3-Gky5O/General-Ledger_suMr6#_luRdZ)

## Installation

```
COPY .env.example to .env
```

```bash
$ npm install
```

We're using mongodb to store journal entries. So, you should download and install a MongoDB GUI tool to check the stored data like [Robo 3T](https://robomongo.org/download).

## Running the app

### Manually

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Use Docker

```sh
$ cd /your/ons-ledger-dir
$ docker-compose up
```

## Development

On your local machine, you have to add this env variable `ONS_GENERAL_LEDGER_URL=http://ons-ledger:4000/graphql` to .env file of the serverless function which you want to integrate ledger service.

Example code:
```ts
const createJournalEntry = async (
  entry: TJournalEntryPayload
): Promise<boolean> => {
  const res = await ledgerGraphQuery(CREATE_JOURNAL_ENTRY, entry);
  if (!res?.data?.createJournalEntry?.success) {
    throw Error("Can't process journal entries");
  }
  return true;
};
```

You can use [GraphQL console](http://localhost:4000/graphql) to test your query before applying to the code.

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Troubleshooting