import { Any } from "@react-spring/web";
import { api } from "../../features";

const rolesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getRoles: build.query<any, void>({
      query: () => `/role`,
    }),
  }),
});

export const {useGetRolesQuery} =
rolesApi;

export default rolesApi;
