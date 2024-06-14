import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import {
//   IBiznessEventProcessConfiguration,
//   IProcessBiznessEventProcessConfiguration,
// } from '../../domain/interfaces/BiznessEventProcessConfigurationInterfaces';
// Import the JSON file directly
import { API_BASE_URL } from '../../../public/apiConfig.json';
import { IAccountsNameComboBox } from '../../domain/interfaces/AccountsNameComboBoxInterface';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';

const controllerName: string = `Account`;

// Define a service using a base URL and expected endpoints
export const AccountsNameApiSlice = createApi({
  reducerPath: 'AccountsNameApiSlice',
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
  tagTypes: ['AccountsNameComboBox'],
  endpoints: (builder) => ({
    getAllAccountsNameByCompanyId: builder.query<
      IAccountsNameComboBox[],
      { companyId: number }
    >({
      query: ({ companyId }) =>
        `getAllAccountsNameByCompanyId?companyId=${companyId}`,
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['AccountsNameComboBox'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAllAccountsNameByCompanyIdQuery } = AccountsNameApiSlice;
