import { Item, Items } from "../../interfaces/Items";
import { api } from "../../features/index";
import { ItemProps } from "../../Container/Items/EditItem";

const itemsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllItems: build.query<any, void>({
      query: () => "/items",
      providesTags: () => [{ type: "Items", id: "LIST" }],
    }),
    getItemById: build.query<Items[], number | string>({
      query: (id) => `/items/${id}`,
    }),
    addItem: build.mutation<Items, FormData>({
      query: (item) => ({
        url: "/items",
        method: "POST",
        body: item,
      }),
      invalidatesTags: ["Items"],
    }),
    deleteItem: build.mutation<void, number>({
      query: (itemId) => ({
        url: `/items/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Items"],
    }),
    editItem: build.mutation<Item, { itemId: string; item: ItemProps }>({
      query: ({ itemId, item }) => ({
        url: `/items/${itemId}`,
        method: "PUT",
        body: item,
      }),
      invalidatesTags: ["Items"],
    }),
    archiveItem: build.mutation<void, number>({
      query: (itemId) => ({
        url: `/items/archive/${itemId}`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useGetAllItemsQuery,
  useGetItemByIdQuery,
  useAddItemMutation,
  useDeleteItemMutation,
  useEditItemMutation,
  useArchiveItemMutation,
} = itemsApi;
