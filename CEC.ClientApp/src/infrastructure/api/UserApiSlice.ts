/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Import the JSON file directly
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../../public/apiConfig.json';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import { ResultModel } from '../../domain/interfaces/ResultModel';
import {
  UserResponseModel,
  UserSaveRequestModel,
} from '../../domain/interfaces/UserResponseModel';

const controllerName: string = `User`;

// Define a service using a base URL and expected endpoints
export const UserApiSlice = createApi({
  reducerPath: 'UserApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/${controllerName}/`,
    prepareHeaders: async (headers) => {
      headers.set('Content-Type', 'application/json');
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
  tagTypes: ['userResult'],
  endpoints: (builder) => ({
    getUserById: builder.mutation<ResultModel<UserResponseModel>, number>({
      query: (id: number) => ({
        url: 'get-by-id',
        method: 'POST',
        body: id,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error: any) {
          toast.error(error.error.message);
        }
      },
    }),
    saveUser: builder.mutation<
      ResultModel<UserResponseModel>,
      UserSaveRequestModel
    >({
      query: (objToSend: UserSaveRequestModel) => ({
        url: 'save',
        method: 'POST',
        body: objToSend,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error: any) {
          toast.error(error.error.message);
        }
      },
    }),
    getAllUser: builder.query<
      ResultModel<UserResponseModel[]>,
      IPaginationModel
    >({
      query: (objToSend: IPaginationModel) => ({
        url: 'get-all',
        method: 'POST',
        body: objToSend,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error: any) {
          toast.error(error.error.message);
        }
      },
    }),
    getAllUserCount: builder.query<ResultModel<number>, IPaginationModel>({
      query: (objToSend: IPaginationModel) => ({
        url: 'get-all-count',
        method: 'POST',
        body: objToSend,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error: any) {
          toast.error(error.error.message);
        }
      },
    }),
    deleteUser: builder.mutation<ResultModel<boolean>, number>({
      query: (id: number) => ({
        url: 'delete',
        method: 'POST',
        body: id,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error: any) {
          toast.error(error.error.message);
        }
      },
    }),
  }),
});

export const {
  useGetUserByIdMutation,
  useSaveUserMutation,
  useDeleteUserMutation,
  useGetAllUserQuery,
  useGetAllUserCountQuery,
} = UserApiSlice;
