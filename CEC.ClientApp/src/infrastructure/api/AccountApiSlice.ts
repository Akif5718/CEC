/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Import the JSON file directly
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../../public/apiConfig.json';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import { ILoginRequest, ILoginResponse } from '../../domain/interfaces/LoginModel';
import { ResultModel } from '../../domain/interfaces/ResultModel';

const controllerName: string = `Account`;

// Define a service using a base URL and expected endpoints
export const AccountApiSlice = createApi({
  reducerPath: 'AccountApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/${controllerName}/`,
    prepareHeaders: async (headers, {endpoint}) => {
      if (endpoint !== 'login') {
        const token = await getToken();
        const jsonUserInfo = localStorage.getItem('userInfo');
        let userId = 0;
        if(jsonUserInfo){
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
  tagTypes: [
    'userInfo',
  ],
  endpoints: (builder) => ({
    login: builder.mutation<
    ResultModel<ILoginResponse>,
    ILoginRequest
    >({
      query: (objToSend: ILoginRequest) => ({
        url: 'Login',
        method: 'POST',
        body: objToSend,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Save the response to localStorage
          localStorage.setItem('userInfo', (JSON.stringify(data.data)));
        } catch (error : any) {
          localStorage.setItem('loginError', JSON.stringify(error.error) );
        }
    }
    }),
    
  }),
});

export const {
    useLoginMutation
} = AccountApiSlice;
