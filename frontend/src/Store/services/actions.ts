import { Any } from "@react-spring/web";
import { api } from "../../features";

const actionsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getActions: build.query<any, void>({
      query: () => `/actions`,
    }),
    addActions: build.mutation<any, any>({
      query: (actions) => ({
        url: "/actions",
        method: "POST",
        body: actions,
      }),
    }),
    deleteActions: build.mutation<void, number>({
      query: (itemId) => ({
        url: `/actions/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Items"],
    }),
    getActionsByInvoiceNumber: build.query<any, number | string>({
      query: (id) => `/actions/${id}`,
    }),
    editActions: build.mutation<any, { invoice_number: any; invoice_body: any }>({
      query: ({ invoice_number, invoice_body }) => ({
        url: `/actions/${invoice_number}`,
        method: "PUT",
        body: invoice_body,
      })
    }),
  }),
});

export const { useGetActionsQuery, useAddActionsMutation, useDeleteActionsMutation,useGetActionsByInvoiceNumberQuery, useEditActionsMutation } = actionsApi;

export default actionsApi;
