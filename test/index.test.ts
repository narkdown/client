import process from 'node:process';
import dotenv from 'dotenv';
import {NotionFaker} from '@narkdown/notion-faker';
import {
  ListBlockChildrenResponse,
  ListDatabasesResponse,
  ListUsersResponse,
  QueryDatabaseResponse,
  SearchResponse,
} from '@notionhq/client/build/src/api-endpoints';
import {NarkdownClient} from '../src';

dotenv.config();

const NOTION_API_KEY = process.env.NOTION_API_KEY!;
const ENTRY_POINT_PAGE_ID = process.env.ENTRY_POINT_PAGE_ID!;
const narkdown: NarkdownClient = new NarkdownClient({auth: NOTION_API_KEY});
const notionFaker: NotionFaker = new NotionFaker();
const TIMEOUT = 1000 * 60 * 10;

describe('unlimited.blocks.children.list', () => {
  const CHILD_COUNT = 101;
  let TEST_PAGE_ID: string;
  let response: ListBlockChildrenResponse;

  beforeAll(async () => {
    const {id: testPageId} = await narkdown.pages.create({
      parent: {
        page_id: ENTRY_POINT_PAGE_ID,
      },
      properties: {
        title: notionFaker.page.properties.title()()(),
      },
    });

    TEST_PAGE_ID = testPageId;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const _ of Array.from({length: CHILD_COUNT})) {
      // eslint-disable-next-line no-await-in-loop
      await narkdown.blocks.children.append({
        block_id: TEST_PAGE_ID,
        children: [
          {
            object: 'block',
            type: 'heading_2',
            heading_2: {
              text: [
                {
                  type: 'text',
                  text: {
                    content: 'Lacinato kale',
                  },
                },
              ],
            },
          },
        ],
      });
    }

    response = await narkdown.unlimited.blocks.children.list({
      block_id: TEST_PAGE_ID,
    });
  }, TIMEOUT);

  afterAll(async () => {
    await narkdown.blocks.delete({
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
      expect(response.results.length).toBe(CHILD_COUNT);
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
  const ROW_COUNT = 101;
  let TEST_PAGE_ID: string;
  let TEST_DATABASE_ID: string;
  let response: QueryDatabaseResponse;

  beforeAll(async () => {
    const {id: testPageId} = await narkdown.pages.create({
      parent: {
        page_id: ENTRY_POINT_PAGE_ID,
      },
      properties: {
        title: notionFaker.page.properties.title()()(),
      },
      icon: notionFaker.icon.emoji(),
    });

    TEST_PAGE_ID = testPageId;

    const {id: testDatabaseId} = await narkdown.databases.create({
      parent: {
        page_id: TEST_PAGE_ID,
      },
      title: notionFaker.database.title()()(),
      properties: {
        title: notionFaker.database.properties.title(),
      },
    });

    TEST_DATABASE_ID = testDatabaseId;

    await Promise.all(
      Array.from({
        length: ROW_COUNT,
      }).map(async () =>
        narkdown.pages.create({
          parent: {database_id: TEST_DATABASE_ID},
          properties: {
            title: notionFaker.page.properties.title('address.cityName')()(),
          },
        }),
      ),
    );

    response = await narkdown.unlimited.databases.query({
      database_id: TEST_DATABASE_ID,
    });
  }, TIMEOUT);

  afterAll(async () => {
    await narkdown.blocks.delete({
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
      expect(response.results.length).toBe(ROW_COUNT);
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
  const ROW_COUNT = 101;
  const SOME_UNIQUE_STRING_FOR_SEARCH = 'SOME_UNIQUE_STRING_FOR_SEARCH';
  let TEST_PAGE_ID: string;
  let TEST_DATABASE_ID: string;
  let response: SearchResponse;

  beforeAll(async () => {
    const {id: testPageId} = await narkdown.pages.create({
      parent: {
        page_id: ENTRY_POINT_PAGE_ID,
      },
      properties: {
        title: notionFaker.page.properties.title()()(),
      },
      icon: notionFaker.icon.emoji(),
    });

    TEST_PAGE_ID = testPageId;

    const {id: testDatabaseId} = await narkdown.databases.create({
      parent: {
        page_id: TEST_PAGE_ID,
      },
      title: notionFaker.database.title()()(),
      properties: {
        title: notionFaker.database.properties.title(),
      },
    });

    TEST_DATABASE_ID = testDatabaseId;

    await Promise.all(
      Array.from({
        length: ROW_COUNT,
      }).map(async () =>
        narkdown.pages.create({
          parent: {database_id: TEST_DATABASE_ID},
          properties: {
            title: {
              title: [
                {
                  text: {
                    content: SOME_UNIQUE_STRING_FOR_SEARCH,
                  },
                },
              ],
            },
          },
        }),
      ),
    );

    response = await narkdown.unlimited.search({
      query: SOME_UNIQUE_STRING_FOR_SEARCH,
    });
  }, TIMEOUT);

  afterAll(async () => {
    await narkdown.blocks.delete({
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

  // NOTE: The current search result is not accurate.
  //
  // it(
  //   'results.length',
  //   async () => {
  //     expect(response.results.length).toBeGreaterThan(100);
  //   },
  //   TIMEOUT,
  // );

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
