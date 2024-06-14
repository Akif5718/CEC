/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Import the JSON file directly
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../../public/apiConfig.json';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';
import { ILoginRequest, ILoginResponse } from '../../domain/interfaces/LoginModel';

const controllerName: string = `Account`;

// Define a service using a base URL and expected endpoints
export const AccountApiSlice = createApi({
  reducerPath: 'AccountApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/${controllerName}/`,
    // token er kaaj shuru
    prepareHeaders: async (headers) => {
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
      return headers;
    },
    // token er kaaj shesh
  }),
  tagTypes: [
    'userInfo',
  ],
  endpoints: (builder) => ({
    login: builder.mutation<
    ILoginResponse,
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
          localStorage.setItem('userInfo', JSON.stringify(data));
        } catch (error) {
          console.error('Error saving data to localStorage', error);
        }
    }
    }),
    // register: builder.query<
    //   IProcurementAccount[],
    //   { tenderId: number }
    // >({
    //   query: ({ tenderId }) =>
    //     `getProcurementAccountByAccountId?tenderId=${tenderId}`,
    //   // providesTags: () => [], // Disable caching by always providing an empty array of tags
    //   providesTags: ['procurementAccount'],
    // }),
    // getProcurementAccountDetailByAccountId: builder.query<
    //   IProcurementAccountDetail[],
    //   { tenderId: number }
    // >({
    //   query: ({ tenderId }) =>
    //     `getProcurementAccountDetailByAccountId?tenderId=${tenderId}`,
    //   // providesTags: () => [], // Disable caching by always providing an empty array of tags
    //   providesTags: ['procurementAccountDetail'],
    // }),
    // getProcurementAccountAdditionalCostByAccountId: builder.query<
    //   IProcurementAccountAdditionalCost[],
    //   { tenderId: number }
    // >({
    //   query: ({ tenderId }) =>
    //     `getProcurementAccountAdditionalCostByAccountId?tenderId=${tenderId}`,
    //   // providesTags: () => [], // Disable caching by always providing an empty array of tags
    //   providesTags: ['procurementAccountAdditionalCost'],
    // }),

    // getPreviousAccountHistoryByDateRange: builder.query<
    //   IAccountHistory,
    //   { fromDate: string; toDate: string }
    // >({
    //   query: ({ fromDate, toDate }) =>
    //     `getPreviousAccountHistoryByDateRange?fromDate=${fromDate}&toDate=${toDate}`,
    //   // providesTags: () => [], // Disable caching by always providing an empty array of tags
    //   providesTags: ['tenderHistory'],
    // }),

    // processSaveAccount: builder.mutation<
    //   IAccountNoComboBox,
    //   IProcurementAccountProcessCommandsVM
    // >({
    //   query: (objToProcess: IProcurementAccountProcessCommandsVM) => ({
    //     url: 'process',
    //     method: 'POST',
    //     body: objToProcess,
    //   }),
    //   invalidatesTags: [
    //     'tenderOptions',
    //     'procurementAccount',
    //     'procurementAccountDetail',
    //     'procurementAccountAdditionalCost',
    //     'tenderHistory',
    //   ],
    // }),
    
  }),
});

export const {
    useLoginMutation
} = AccountApiSlice;
