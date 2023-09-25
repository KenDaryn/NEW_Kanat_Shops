import { Any } from "@react-spring/web";
import { api } from "../../features";

const historyApi = api.injectEndpoints({
  endpoints: (build) => ({
    getHistory: build.query<any, void>({
      query: () => `/history`,
    }),
  }),
});

export const {useGetHistoryQuery} = historyApi;

export default historyApi;
