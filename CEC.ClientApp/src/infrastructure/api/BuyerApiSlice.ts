/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Import the JSON file directly
import { API_BASE_URL } from '../../../public/apiConfig.json';
import { IProductGroupComboBox } from '../../domain/interfaces/ProductInterfaces';
import { IBuyer } from '../../domain/interfaces/BuyerInterface';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';

const controllerName: string = `Buyer`;

// Define a service using a base URL and expected endpoints
export const BuyerApiSlice = createApi({
  reducerPath: 'BuyerApi',
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
  tagTypes: ['buyerOptions'],
  endpoints: (builder) => ({
    // getBuyerByCompanyLocationId
    getBuyerByCompanyLocationId: builder.query<
      IBuyer[],
      { companyId: number; locationId: number }
    >({
      query: ({ companyId, locationId }) =>
        `getBuyerByCompanyLocationId?companyId=${companyId}&locationId=${locationId}`,

      providesTags: () => [], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetBuyerByCompanyLocationIdQuery } = BuyerApiSlice;
