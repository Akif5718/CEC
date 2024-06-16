import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../../public/apiConfig.json';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import { ResultModel } from '../../domain/interfaces/ResultModel';
import {
  SearchRequestModel,
  SearchResponseModel,
} from '../../domain/interfaces/SearchModel';

const controllerName: string = `Search`;

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
        headers.set('UserId', userId.toString());
      }
      return headers;
    },
  }),
  tagTypes: ['SearchResults'], // Define a tag type for caching
  endpoints: (builder) => ({
    getAll: builder.query<ResultModel<SearchResponseModel>, SearchRequestModel>(
      {
        query: (objToSend: SearchRequestModel) => ({
          url: 'get-all',
          method: 'POST',
          body: objToSend,
        }),
      }
    ),
  }),
});

export const { useGetAllQuery } = SearchApiSlice;
