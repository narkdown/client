import process from 'node:process';
import dotenv from 'dotenv';
import {
  ListBlockChildrenResponse,
  ListDatabasesResponse,
  ListUsersResponse,
  QueryDatabaseResponse,
  SearchResponse,
} from '@notionhq/client/build/src/api-endpoints';
import {extractIdFromUrl} from '@narkdown/notion-utils';
import {NarkdownClient} from '../src';

dotenv.config();

const NOTION_API_KEY = process.env.NOTION_API_KEY!;
const narkdown: NarkdownClient = new NarkdownClient({auth: NOTION_API_KEY});
const TIMEOUT = 1000 * 60 * 2;

describe('unlimited.blocks.children.list', () => {
  const TEST_PAGE_ID = extractIdFromUrl(
    'https://narkdown.notion.site/et-tempore-iste-36d1060897c442399eb86e1f98dd31d4',
  );
  let response: ListBlockChildrenResponse;

  beforeAll(async () => {
    response = await narkdown.unlimited.blocks.children.list({
      block_id: TEST_PAGE_ID,
    });
  }, TIMEOUT);
  it(
    'has properties',
    async () => {
      expect(response).toHaveProperty('has_more');
      expect(response).toHaveProperty('next_cursor');
      expect(response).toHaveProperty('results');
      expect(response).toHaveProperty('object');
    },
    TIMEOUT,
  );

  it(
    'object is always list',
    async () => {
      expect(response.object).toBe('list');
    },
    TIMEOUT,
  );

  it(
    'results.length is ROW_COUNT',
    async () => {
      expect(response.results.length).toBeGreaterThan(100);
    },
    TIMEOUT,
  );

  it(
    'next_cursor is null',
    async () => {
      expect(response.next_cursor).toBeNull();
    },
    TIMEOUT,
  );

  it(
    'has_more is false',
    async () => {
      expect(response.has_more).toBeFalsy();
    },
    TIMEOUT,
  );
});

describe('unlimited.databases.query', () => {
  const TEST_DATABASE_ID = extractIdFromUrl(
    'https://narkdown.notion.site/6b218cf027f54743ac7635fcbae61d18?v=c7e32351677e4d6b9936235d72a4def4',
  );
  let response: QueryDatabaseResponse;

  beforeAll(async () => {
    response = await narkdown.unlimited.databases.query({
      database_id: TEST_DATABASE_ID,
    });
  }, TIMEOUT);

  it(
    'has properties',
    async () => {
      expect(response).toHaveProperty('has_more');
      expect(response).toHaveProperty('next_cursor');
      expect(response).toHaveProperty('results');
      expect(response).toHaveProperty('object');
    },
    TIMEOUT,
  );

  it(
    'object is always list',
    async () => {
      expect(response.object).toBe('list');
    },
    TIMEOUT,
  );

  it(
    'results.length is ROW_COUNT',
    async () => {
      expect(response.results.length).toBeGreaterThan(100);
    },
    TIMEOUT,
  );

  it(
    'next_cursor is null',
    async () => {
      expect(response.next_cursor).toBeNull();
    },
    TIMEOUT,
  );

  it(
    'has_more is false',
    async () => {
      expect(response.has_more).toBeFalsy();
    },
    TIMEOUT,
  );
});

describe('unlimited.databases.list', () => {
  let response: ListDatabasesResponse;

  beforeAll(async () => {
    response = await narkdown.unlimited.databases.list({});
  }, TIMEOUT);

  it(
    'has properties',
    async () => {
      expect(response).toHaveProperty('has_more');
      expect(response).toHaveProperty('next_cursor');
      expect(response).toHaveProperty('results');
      expect(response).toHaveProperty('object');
    },
    TIMEOUT,
  );

  it(
    'object is always list',
    async () => {
      expect(response.object).toBe('list');
    },
    TIMEOUT,
  );

  it(
    'results.length',
    async () => {
      expect(response.results.length).toBe(1);
    },
    TIMEOUT,
  );

  it(
    'next_cursor is null',
    async () => {
      expect(response.next_cursor).toBeNull();
    },
    TIMEOUT,
  );

  it(
    'has_more is false',
    async () => {
      expect(response.has_more).toBeFalsy();
    },
    TIMEOUT,
  );
});

describe('unlimited.users.list', () => {
  let response: ListUsersResponse;

  beforeAll(async () => {
    response = await narkdown.unlimited.users.list({});
  }, TIMEOUT);

  it(
    'has properties',
    async () => {
      expect(response).toHaveProperty('has_more');
      expect(response).toHaveProperty('next_cursor');
      expect(response).toHaveProperty('results');
      expect(response).toHaveProperty('object');
    },
    TIMEOUT,
  );

  it(
    'object is always list',
    async () => {
      expect(response.object).toBe('list');
    },
    TIMEOUT,
  );

  it(
    'results.length',
    async () => {
      expect(response.results.length).toBe(2);
    },
    TIMEOUT,
  );

  it(
    'next_cursor is null',
    async () => {
      expect(response.next_cursor).toBeNull();
    },
    TIMEOUT,
  );

  it(
    'has_more is false',
    async () => {
      expect(response.has_more).toBeFalsy();
    },
    TIMEOUT,
  );
});

describe('unlimited.search', () => {
  const SOME_UNIQUE_STRING_FOR_SEARCH = 'SOME_UNIQUE_STRING_FOR_SEARCH';
  let response: SearchResponse;

  beforeAll(async () => {
    response = await narkdown.unlimited.search({
      query: SOME_UNIQUE_STRING_FOR_SEARCH,
    });
  }, TIMEOUT);

  it(
    'has properties',
    async () => {
      expect(response).toHaveProperty('has_more');
      expect(response).toHaveProperty('next_cursor');
      expect(response).toHaveProperty('results');
      expect(response).toHaveProperty('object');
    },
    TIMEOUT,
  );

  it(
    'object is always list',
    async () => {
      expect(response.object).toBe('list');
    },
    TIMEOUT,
  );

  it(
    'results.length',
    async () => {
      expect(response.results.length).toBeGreaterThan(100);
    },
    TIMEOUT,
  );

  it(
    'next_cursor is null',
    async () => {
      expect(response.next_cursor).toBeNull();
    },
    TIMEOUT,
  );

  it(
    'has_more is false',
    async () => {
      expect(response.has_more).toBeFalsy();
    },
    TIMEOUT,
  );
});
