import { api } from '../../features';

const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<any, void>({
      query: () => `/users`,
    }),
    change: build.mutation<any, any>({
      query: (body) => ({
        url: "users/change",
        method: "post",
        body,
      }),
    }),
  }),
});

export const { useGetUsersQuery, useChangeMutation } = authApi;

export default authApi;