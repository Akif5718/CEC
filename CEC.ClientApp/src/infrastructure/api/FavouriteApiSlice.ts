import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../../public/apiConfig.json';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import { ResultModel } from '../../domain/interfaces/ResultModel';
import { FavouriteRequestModel } from '../../domain/interfaces/FavouriteModel';

const controllerName: string = `Favourite`;

export const FavouriteApiSlice = createApi({
  reducerPath: 'FavouriteApi',
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
  tagTypes: ['SearchResults'],
  endpoints: (builder) => ({
    saveFavourite: builder.mutation<
      ResultModel<boolean>,
      FavouriteRequestModel
    >({
      query: (objToSend: FavouriteRequestModel) => ({
        url: 'save',
        method: 'POST',
        body: objToSend,
      }),
      invalidatesTags: ['SearchResults'], // Use object syntax and const assertion
    }),
  }),
});

export const { useSaveFavouriteMutation } = FavouriteApiSlice;
