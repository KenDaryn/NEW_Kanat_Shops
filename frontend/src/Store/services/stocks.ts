import { Any } from "@react-spring/web";
import { api } from "../../features";

const stocksApi = api.injectEndpoints({
  endpoints: (build) => ({
    getStocks: build.query<any, void>({
      query: () => `/stocks`,
    }),
    getStocksCancel: build.query<any, void>({
        query: () => `/stocks/cancel`,
      }),
    getStocksLess: build.query<any, void>({
      query: () => `/stocks/less`,
    }),
    getStocksReturn: build.query<any, void>({
      query: () => `/stocks/return`,
    }),
    getStocksSendClient: build.query<any, void>({
      query: () => `/stocks/sendClient`,
    }),
    getStockById: build.query<any, number | string>({
      query: (id) => `/stocks/${id}`,
    }),
    getStockSendClientById: build.query<any, number | string>({
      query: (id) => `/stocks/sendClient/${id}`,
    }),
    getStockReturnById: build.query<any, number | string>({
      query: (id) => `/stocks/returnInfo/${id}`,
    }),
    sendClient: build.mutation<any, { itemId: string | undefined; count: any; shop_id:any }>(
      {
        query: ({ itemId, count,shop_id }) => ({
          url: `/stocks/sendClient/${itemId}`,
          method: "PUT",
          body: { count: count, shop_id:shop_id },
        }),
      }
    ),
    sendReturn: build.mutation<any, { itemId: string | undefined; count: any;shop_id:any }>(
      {
        query: ({ itemId, count,shop_id }) => ({
          url: `/stocks/sendReturn/${itemId}`,
          method: "PUT",
          body: { count: count,shop_id:shop_id },
        }),
      }
    ),    
    returnSendStock: build.mutation<any, { itemId: string | undefined; count: any;shop_id:any }>({
      query: ({ itemId, count,shop_id }) => ({
        url: `/stocks/returnSendStock/${itemId}`,
        method: "PUT",
        body: { count: count,shop_id:shop_id },
      }),
    }),
    sendStock: build.mutation<any, { itemId: string | undefined; count: any;shop_id:any }>({
      query: ({ itemId, count,shop_id }) => ({
        url: `/stocks/sendStock/${itemId}`,
        method: "PUT",
        body: { count: count,shop_id:shop_id },
      }),
    }),
    sendCancelReturn: build.mutation<any, { itemId: string | undefined; count: any;shop_id:any }>(
        {
          query: ({ itemId, count,shop_id }) => ({
            url: `/stocks/cancelReturn/${itemId}`,
            method: "PUT",
            body: { count: count,shop_id:shop_id },
          }),
        }
      ),    
    sendCancel: build.mutation<any, { itemId: string | undefined; count: any;shop_id:any }>(
      {
        query: ({ itemId, count,shop_id }) => ({
          url: `/stocks/cancel/${itemId}`,
          method: "PUT",
          body: { count: count,shop_id:shop_id },
        }),
      }
    ),
  }),
});

export const {
  useGetStocksQuery,
  useGetStockByIdQuery,
  useSendClientMutation,
  useSendCancelMutation,
  useGetStocksLessQuery,
  useGetStocksSendClientQuery,
  useSendStockMutation,
  useGetStockSendClientByIdQuery,
  useSendReturnMutation,
  useGetStocksReturnQuery,
  useGetStockReturnByIdQuery,
  useGetStocksCancelQuery,
  useSendCancelReturnMutation,
  useReturnSendStockMutation
} = stocksApi;

export default stocksApi;
