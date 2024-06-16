/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Import the JSON file directly
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../../public/apiConfig.json';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import { ResultModel } from '../../domain/interfaces/ResultModel';
import {
  SearchRequestModel,
  SearchResponseModel,
} from '../../domain/interfaces/SearchModel';

const controllerName: string = `Search`;

// Define a service using a base URL and expected endpoints
export const SearchApiSlice = createApi({
  reducerPath: 'SearchApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/${controllerName}/`,
    prepareHeaders: async (headers) => {
      const token = await getToken();
      const jsonUserInfo = localStorage.getItem('userInfo');
      let userId = 0;
      if (jsonUserInfo) {
        userId = JSON.parse(jsonUserInfo).userId as number;
      }
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      if (userId) {
        headers.set('UserId', userId.toString()); // Setting user ID in headers
      }
      return headers;
    },
  }),
  tagTypes: ['searchResult'],
  endpoints: (builder) => ({
    getAll: builder.query<ResultModel<SearchResponseModel>, SearchRequestModel>(
      {
        query: (objToSend: SearchRequestModel) => ({
          url: 'get-all',
          method: 'POST',
          body: objToSend,
        }),
        async onQueryStarted(arg, { queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
          } catch (error) {
            console.error('Error saving data to localStorage', error);
          }
        },
      }
    ),
  }),
});

export const { useGetAllQuery } = SearchApiSlice;
