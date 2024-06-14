import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import {
//   IBiznessEventProcessConfiguration,
//   IProcessBiznessEventProcessConfiguration,
// } from '../../domain/interfaces/BiznessEventProcessConfigurationInterfaces';
// Import the JSON file directly
import { API_BASE_URL } from '../../../public/apiConfig.json';
import { ISANextEvent } from '../../domain/interfaces/SANextEventInterface';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';

const controllerName: string = `SA_NextEvent`;
// Define a service using a base URL and expected endpoints
export const SANextEventApiSlice = createApi({
  reducerPath: 'SANextEventApiSlice',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/${controllerName}/`,

    prepareHeaders: async (headers) => {
      const token = await getToken();
      headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['SANextEvent'],
  endpoints: (builder) => ({
    getSANextEventByCompanyLocationUserFixedTaskTemplateId: builder.query<
      ISANextEvent[],
      {
        userId: number;
        companyId: number;
        locationId: number;
        fixedTaskTemplateId: number;
      }
    >({
      query: ({ userId, companyId, locationId, fixedTaskTemplateId }) =>
        `getByCompanyLocationUserFixedTaskTemplateId?userId=${userId}&companyId=${companyId}&locationId=${locationId}&fixedTaskTemplateId=${fixedTaskTemplateId}`,
      transformResponse: (rawData: any[]) => {
        console.log('SA_NEXT EVENT ALL DATA---------------->');
        console.log(rawData);

        // Extract only the 'roll' property from the response
        const extractedData = rawData.map((item) => {
          const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          };
          const assignedDateString = item.assignedDate;
          const dueDateString = item.dueDate;
          const assignedDateJs = new Date(assignedDateString);
          const dueDateJs = new Date(dueDateString);

          const assignedFormattedDate = assignedDateJs.toLocaleDateString(
            'en-US',
            options
          );
          const dueFormattedDate = dueDateJs.toLocaleDateString(
            'en-US',
            options
          );
          return {
            ...item,
            assignedDate: assignedFormattedDate,
            dueDate: dueFormattedDate,
          };
        });
        return extractedData;
      },
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['SANextEvent'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetSANextEventByCompanyLocationUserFixedTaskTemplateIdQuery,
} = SANextEventApiSlice;
