import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IFixedTaskTemplateAutoComp } from '../../domain/interfaces/FixedTaskTemplateInterface';
import { API_BASE_URL } from '../../../public/apiConfig.json';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
// Define a service using a base URL and expected endpoints
export const fixedTaskTemplateApi = createApi({
  reducerPath: 'fixedTaskTemplateApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/FixedTaskTemplate/`,
    // token er kaaj shuru
    prepareHeaders: async (headers) => {
      const token = await getToken();
      headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
    // token er kaaj shesh
  }),
  endpoints: (builder) => ({
    getFixedTaskTemplateComboOptions: builder.query<
      IFixedTaskTemplateAutoComp[],
      number
    >({
      query: (companyId) => `getAll?companyId=${companyId}`, //
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetFixedTaskTemplateComboOptionsQuery } =
  fixedTaskTemplateApi;
