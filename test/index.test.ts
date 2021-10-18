import process from 'node:process';
import dotenv from 'dotenv';
import NotionFaker from '@narkdown/notion-faker';
import {QueryDatabaseResponse} from '@notionhq/client/build/src/api-endpoints';
import NarkdownClient from '../src';

dotenv.config();

const NOTION_API_KEY = process.env.NOTION_API_KEY!;
const ENTRY_POINT_PAGE_ID = process.env.ENTRY_POINT_PAGE_ID!;
const narkdown: NarkdownClient = new NarkdownClient({auth: NOTION_API_KEY});
const notionFaker: NotionFaker = new NotionFaker();
const ROW_COUNT = 200;
const TIMEOUT = 1000 * 60 * 10;

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

  response = await narkdown.unlimited.databases.queryAll({
    database_id: TEST_DATABASE_ID,
  });
}, TIMEOUT);

/** {@link https://developers.notion.com/reference/pagination#responses} */
describe('response of narkdown.unlimited.databases.queryAll', () => {
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

afterAll(async () => {
  await narkdown.blocks.delete({
    block_id: TEST_PAGE_ID,
  });
}, TIMEOUT);
