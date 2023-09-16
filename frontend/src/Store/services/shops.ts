import { Any } from "@react-spring/web";
import { api } from "../../features";

const shopsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getShops: build.query<any, void>({
      query: () => `/shops`,
    }),
    deleteShop: build.mutation<void, number>({
      query: (shopsId) => ({
        url: `/shops/${shopsId}`,
        method: "DELETE",
      }),
    }),
    addShops: build.mutation<any, any>({
      query: (shop) => ({
        url: "/shops",
        method: "POST",
        body: shop,
      }),
    }),
  }),
});

export const { useGetShopsQuery, useDeleteShopMutation, useAddShopsMutation } =
  shopsApi;

export default shopsApi;
