/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Import the JSON file directly
import { API_BASE_URL } from '../../../public/apiConfig.json';

import {
  IProductComboBox,
  IProductGroupComboBox,
} from '../../domain/interfaces/ProductInterfaces';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';

const controllerName: string = `Product`;

// Define a service using a base URL and expected endpoints
export const ProductApiSlice = createApi({
  reducerPath: 'ProductApi',
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
  tagTypes: ['productGroupOptions', 'productOptions'],
  endpoints: (builder) => ({
    getProductGroupByCompanyId: builder.query<
      IProductGroupComboBox[],
      { companyId: number }
    >({
      query: ({ companyId }) =>
        `getProductGroupByCompanyId?companyId=${companyId}`,

      providesTags: () => [], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),
    // /api/Product/getProductByCompanyProductGroupId
    getProductByCompanyProductGroupId: builder.query<
      IProductComboBox[],
      { companyId: number; productGroupId: number }
    >({
      query: ({ companyId, productGroupId }) =>
        `getProductByCompanyProductGroupId?companyId=${companyId}&productGroupId=${productGroupId}`,

      providesTags: () => [], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetProductGroupByCompanyIdQuery,
  useGetProductByCompanyProductGroupIdQuery,
} = ProductApiSlice;
