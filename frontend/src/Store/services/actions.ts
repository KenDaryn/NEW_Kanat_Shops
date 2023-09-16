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
  }),
});

export const { useGetActionsQuery, useAddActionsMutation } = actionsApi;

export default actionsApi;
