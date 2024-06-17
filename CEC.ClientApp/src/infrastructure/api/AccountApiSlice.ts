/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Import the JSON file directly
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../../public/apiConfig.json';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import {
  ILoginRequest,
  ILoginResponse,
} from '../../domain/interfaces/LoginModel';
import { ResultModel } from '../../domain/interfaces/ResultModel';
import { SignUpRequestModel } from '../../domain/interfaces/SignUpModel';
import { UserResponseModel } from '../../domain/interfaces/UserResponseModel';
import { ChangeUserPasswordModel } from '../../domain/interfaces/ChangeUserPasswordModel';

const controllerName: string = `Account`;

// Define a service using a base URL and expected endpoints
export const AccountApiSlice = createApi({
  reducerPath: 'AccountApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/${controllerName}/`,
    prepareHeaders: async (headers, { endpoint }) => {
      if (endpoint !== 'login' && endpoint !== 'signup') {
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
      }
      return headers;
    },
  }),
  tagTypes: ['userInfo'],
  endpoints: (builder) => ({
    login: builder.mutation<ResultModel<ILoginResponse>, ILoginRequest>({
      query: (objToSend: ILoginRequest) => ({
        url: 'Login',
        method: 'POST',
        body: objToSend,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Save the response to localStorage
          localStorage.setItem('userInfo', JSON.stringify(data.data));
        } catch (error: any) {
          localStorage.setItem('loginError', JSON.stringify(error.error));
        }
      },
    }),

    signup: builder.mutation<ResultModel<boolean>, SignUpRequestModel>({
      query: (objToSend: ILoginRequest) => ({
        url: 'register',
        method: 'POST',
        body: objToSend,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Save the response to localStorage
          toast.success(data.message);
        } catch (error: any) {
          localStorage.setItem('signUpError', JSON.stringify(error.error));
        }
      },
    }),
    changePassword: builder.mutation<
      ResultModel<boolean>,
      ChangeUserPasswordModel
    >({
      query: (objToSend: ChangeUserPasswordModel) => ({
        url: 'change-password',
        method: 'POST',
        body: objToSend,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Save the response to localStorage
          if (!data.data) {
            toast.error(data.message);
          } else {
            toast.success(data.message);
          }
        } catch (error: any) {
          localStorage.setItem('Error ', JSON.stringify(error.error));
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useChangePasswordMutation,
} = AccountApiSlice;
