import {Client as NotionClient} from '@notionhq/client';
import {
  ListBlockChildrenParameters,
  ListBlockChildrenResponse,
  ListDatabasesParameters,
  ListDatabasesResponse,
  ListUsersParameters,
  ListUsersResponse,
  QueryDatabaseParameters,
  QueryDatabaseResponse,
  SearchParameters,
  SearchResponse,
} from '@notionhq/client/build/src/api-endpoints';

export class NarkdownClient extends NotionClient {
  public readonly unlimited = {
    blocks: {
      children: {
        /**
         * Retrieve block children without pagination
         */
        list: async ({
          start_cursor,
          ...rest
        }: ListBlockChildrenParameters): Promise<ListBlockChildrenResponse> => {
          const response: ListBlockChildrenResponse =
            await this.blocks.children.list({
              start_cursor,
              ...rest,
            });

          if (!response.has_more) return response;

          const nextResponse = await this.unlimited.blocks.children.list({
            ...rest,
            start_cursor: response.next_cursor ?? undefined,
          });

          return {
            ...nextResponse,
            results: [...response.results, ...nextResponse.results],
          };
        },
      },
    },

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

        const nextResponse = await this.unlimited.databases.query({
          ...rest,
          start_cursor: response.next_cursor ?? undefined,
        });

        return {
          ...nextResponse,
          results: [...response.results, ...nextResponse.results],
        };
      },

      /**
       * List databases without pagination
       *
       * @deprecated Please use `search`
       */
      list: async ({
        start_cursor,
        ...rest
      }: ListDatabasesParameters): Promise<ListDatabasesResponse> => {
        const response: ListDatabasesResponse = await this.databases.list({
          start_cursor,
          ...rest,
        });

        if (!response.has_more) return response;

        const nextResponse = await this.unlimited.databases.list({
          ...rest,
          start_cursor: response.next_cursor ?? undefined,
        });

        return {
          ...nextResponse,
          results: [...response.results, ...nextResponse.results],
        };
      },
    },

    users: {
      /**
       * List all users without pagination
       */
      list: async ({
        start_cursor,
        ...rest
      }: ListUsersParameters): Promise<ListUsersResponse> => {
        const response: ListUsersResponse = await this.users.list({
          start_cursor,
          ...rest,
        });

        if (!response.has_more) return response;

        const nextResponse = await this.unlimited.users.list({
          ...rest,
          start_cursor: response.next_cursor ?? undefined,
        });

        return {
          ...nextResponse,
          results: [...response.results, ...nextResponse.results],
        };
      },
    },

    /**
     * Search without pagination
     */
    search: async ({
      start_cursor,
      ...rest
    }: SearchParameters): Promise<SearchResponse> => {
      const response: SearchResponse = await this.search({
        start_cursor,
        ...rest,
      });

      if (!response.has_more) return response;

      const nextResponse = await this.unlimited.search({
        ...rest,
        start_cursor: response.next_cursor ?? undefined,
      });

      return {
        ...nextResponse,
        results: [...response.results, ...nextResponse.results],
      };
    },
  };
}
