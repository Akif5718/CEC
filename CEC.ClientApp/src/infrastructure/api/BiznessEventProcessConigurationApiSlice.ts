import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  IBiznessEventProcessConfiguration,
  IProcessBiznessEventProcessConfiguration,
} from '../../domain/interfaces/BiznessEventProcessConfigurationInterfaces';
// Import the JSON file directly
import { API_BASE_URL } from '../../../public/apiConfig.json';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';

const controllerName: string = `BiznessEventProcessConfiguration`;

// Define a service using a base URL and expected endpoints
export const BiznessEventProcessConfigurationApiSlice = createApi({
  reducerPath: 'BiznessEventProcessConfigurationApiSlice',
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
  tagTypes: ['BiznessEventProcessConfiguration'],
  endpoints: (builder) => ({
    getBiznessEventProcessConfigurationsByFixedTaskTemplateId: builder.query<
      IBiznessEventProcessConfiguration[],
      number
    >({
      query: (fixedTaskTemplateId) =>
        `getByFixedTaskTemplateId?fixedTaskTemplateId=${fixedTaskTemplateId}`,
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['BiznessEventProcessConfiguration'],
    }),
    processBiznessEventProcessConfigurations: builder.mutation<
      unknown,
      IProcessBiznessEventProcessConfiguration
    >({
      query: (objToSave) => ({
        url: 'process', // `${API_BASE_URL}/BiznessEventProcessConfiguration/process`,
        method: 'POST',
        body: objToSave,
      }),
      invalidatesTags: ['BiznessEventProcessConfiguration'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetBiznessEventProcessConfigurationsByFixedTaskTemplateIdQuery,
  useProcessBiznessEventProcessConfigurationsMutation,
} = BiznessEventProcessConfigurationApiSlice;
