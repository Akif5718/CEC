/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Import the JSON file directly
import { API_BASE_URL } from '../../../public/apiConfig.json';

import { ISalesPersonComboBox } from '../../domain/interfaces/SalesPersonInterface';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';

const controllerName: string = `Employee`;

// Define a service using a base URL and expected endpoints
export const EmployeeApiSlice = createApi({
  reducerPath: 'EmployeeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/${controllerName}/`,
    // token er kaaj shuru
    prepareHeaders: async (headers) => {
      const token = await getToken();
      headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
    // token er kaaj shesh
  }),
  tagTypes: ['salesPersonOptions'],
  endpoints: (builder) => ({
    getSalesPersonByCompanyLocationBuyerId: builder.query<
      ISalesPersonComboBox[],
      { companyId: number; locationId: number; buyerId: number }
    >({
      query: ({ companyId, locationId, buyerId }) =>
        `getSalesPersonByCompanyLocationBuyerId?companyId=${companyId}&locationId=${locationId}&buyerId=${buyerId}`,

      providesTags: () => [], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetSalesPersonByCompanyLocationBuyerIdQuery } =
  EmployeeApiSlice;
