import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_BASE_URL } from '../../../public/apiConfig.json';
import { IBiznessEventPCTrackVM } from '../../domain/interfaces/BiznessEventPCTrackVMInterface';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';

const controllerName: string = `BiznessEvent_PCTrack`;

// Define a service using a base URL and expected endpoints
export const BiznessEventPCTrackVMForJobHistoryApiSlice = createApi({
  reducerPath: 'BiznessEventPCTrackVMApi',
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
  tagTypes: ['BiznessEventPCTrackVMForJobHistory'],
  endpoints: (builder) => ({
    getBiznessEventPCTrackVMForJobHistoryByFirstEventNo: builder.query<
      IBiznessEventPCTrackVM[],
      { firstEventNo: string }
    >({
      query: ({ firstEventNo }) =>
        `getByFirstEventNo?firstEventNo=${firstEventNo}&type=JobHistory`,

      transformResponse: (rawData: IBiznessEventPCTrackVM[]) => {
        console.log('Job History---> Business Event PC Track VM');
        console.log(rawData);

        const transformedData = rawData.map((item) => {
          const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          };
          const startDateTimeString = item.startDate;
          const endDateTimeString = item.endDate;
          let startFormattedDateTime;
          let endFormattedDateTime;
          if (endDateTimeString) {
            const endDateJs = new Date(endDateTimeString);
            endFormattedDateTime = endDateJs.toLocaleDateString(
              'en-US',
              options
            );
          }
          if (startDateTimeString) {
            const endDateJs = new Date(startDateTimeString);
            startFormattedDateTime = endDateJs.toLocaleDateString(
              'en-US',
              options
            );
          }
          return {
            ...item,
            endDate: endDateTimeString
              ? endFormattedDateTime
              : endDateTimeString,
          };
        });
        return transformedData;
      },
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['BiznessEventPCTrackVMForJobHistory'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetBiznessEventPCTrackVMForJobHistoryByFirstEventNoQuery,
  useLazyGetBiznessEventPCTrackVMForJobHistoryByFirstEventNoQuery,
} = BiznessEventPCTrackVMForJobHistoryApiSlice;
