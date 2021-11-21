import {Client as NotionClient} from '@notionhq/client';
import {
  QueryDatabaseParameters,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';

export class NarkdownClient extends NotionClient {
  public readonly unlimited = {
    databases: {
      /**
       * Query a database without pagination
       */
      query: async ({
        start_cursor,
        ...rest
      }: QueryDatabaseParameters): Promise<QueryDatabaseResponse> => {
        const response: QueryDatabaseResponse = await this.databases.query({
          start_cursor,
          ...rest,
        });

        if (!response.has_more) return response;

        const nextResponse = await this.databases.query({
          ...rest,
          start_cursor: response.next_cursor ?? undefined,
        });

        return {
          ...nextResponse,
          results: [...response.results, ...nextResponse.results],
        };
      },
    },
  };
}
