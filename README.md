# @narkdown/client

> Get unlimited response of Notion API

[![Version: v0.3.1](https://img.shields.io/badge/Version-v0.3.1-green)](https://github.com/narkdown/client/releases/tag/v0.3.1)
[![license: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

## Why?

This is an extension of the [`@notionhq/client`](https://github.com/makenotion/notion-sdk-js) to obtain total results for the [Paginated endpoints](https://developers.notion.com/reference/pagination#paginated-endpoints) of the Notion API.

The goal is to obtain a total results using the same interface as the Notion API.

## Install

```
$ npm install @narkdown/client
```

## Usage

```javascript
const {NarkdownClient} = require('@narkdown/client');

// Initializing a client
const narkdown = new NarkdownClient({
  auth: process.env.NOTION_TOKEN,
});
```

## API

> It extends [@notionhq/client](https://github.com/makenotion/notion-sdk-js)
>
> See the complete list of endpoints in the [Notion API reference](https://developers.notion.com/reference)

### `unlimited.databases.query`

> Unlimited version of [Query a database](https://developers.notion.com/reference/post-database-query)

```javascript
const {NarkdownClient} = require('@narkdown/client');

const narkdown = new NarkdownClient({auth: process.env.NOTION_API_KEY});

(async () => {
  const databaseId = '897e5a76-ae52-4b48-9fdf-e71f5945d1af';
  const response = await narkdown.unlimited.databases.query({
    database_id: databaseId,
    filter: {
      or: [
        {
          property: 'In stock',
          checkbox: {
            equals: true,
          },
        },
        {
          property: 'Cost of next trip',
          number: {
            greater_than_or_equal_to: 2,
          },
        },
      ],
    },
    sorts: [
      {
        property: 'Last ordered',
        direction: 'ascending',
      },
    ],
  });
  console.log(response);
})();
```

## Related

- [makenotion/notion-sdk-js](https://github.com/makenotion/notion-sdk-js)

## License

[MIT](LICENSE)
