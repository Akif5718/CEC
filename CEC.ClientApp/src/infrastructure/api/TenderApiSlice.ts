/* eslint-disable no-param-reassign */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Import the JSON file directly
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../../public/apiConfig.json';

import {
  IProcurementTender,
  IProcurementTenderProcessCommandsVM,
  ITenderHistory,
  ITenderNoComboBox,
} from '../../domain/interfaces/ProcurementTenderInterface';
import { IProcurementTenderDetail } from '../../domain/interfaces/ProcurementTenderDetailInterface';
import { IProcurementTenderAdditionalCost } from '../../domain/interfaces/ProcurementTenderAdditionalCost';
import { getToken } from '../Auth/JWTSecurity/jwtTokenManager';

const controllerName: string = `ProcurementTender`;

// Define a service using a base URL and expected endpoints
export const TenderApiSlice = createApi({
  reducerPath: 'TenderApi',
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
  tagTypes: [
    'tenderOptions',
    'procurementTender',
    'procurementTenderDetail',
    'procurementTenderAdditionalCost',
    'tenderHistory',
  ],
  endpoints: (builder) => ({
    getAllTenderNo: builder.query<ITenderNoComboBox[], void>({
      query: () => `getAllTenderNo`,
      providesTags: () => ['tenderOptions'], // Disable caching by always providing an empty array of tags
      // providesTags: ['chequeBook'],
    }),
    getProcurementTenderByTenderId: builder.query<
      IProcurementTender[],
      { tenderId: number }
    >({
      query: ({ tenderId }) =>
        `getProcurementTenderByTenderId?tenderId=${tenderId}`,
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['procurementTender'],
    }),
    getProcurementTenderDetailByTenderId: builder.query<
      IProcurementTenderDetail[],
      { tenderId: number }
    >({
      query: ({ tenderId }) =>
        `getProcurementTenderDetailByTenderId?tenderId=${tenderId}`,
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['procurementTenderDetail'],
    }),
    getProcurementTenderAdditionalCostByTenderId: builder.query<
      IProcurementTenderAdditionalCost[],
      { tenderId: number }
    >({
      query: ({ tenderId }) =>
        `getProcurementTenderAdditionalCostByTenderId?tenderId=${tenderId}`,
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['procurementTenderAdditionalCost'],
    }),

    getPreviousTenderHistoryByDateRange: builder.query<
      ITenderHistory,
      { fromDate: string; toDate: string }
    >({
      query: ({ fromDate, toDate }) =>
        `getPreviousTenderHistoryByDateRange?fromDate=${fromDate}&toDate=${toDate}`,
      // providesTags: () => [], // Disable caching by always providing an empty array of tags
      providesTags: ['tenderHistory'],
    }),

    processSaveTender: builder.mutation<
      ITenderNoComboBox,
      IProcurementTenderProcessCommandsVM
    >({
      query: (objToProcess: IProcurementTenderProcessCommandsVM) => ({
        url: 'process',
        method: 'POST',
        body: objToProcess,
      }),
      invalidatesTags: [
        'tenderOptions',
        'procurementTender',
        'procurementTenderDetail',
        'procurementTenderAdditionalCost',
        'tenderHistory',
      ],
    }),
    // updateChequeBookCreateChequeBookDetail: builder.mutation<
    //   unknown,
    //   IUpdateChequeBookCommandsVM
    // >({
    //   query: (objToCreate: IUpdateChequeBookCommandsVM) => ({
    //     url: 'updateChequeBookCreateChequeBookDetail',
    //     method: 'POST',
    //     body: objToCreate,
    //   }),
    //   invalidatesTags: ['chequeBookDetailGrid'],
    // }),
    // // deleteChequeBookChequeBookDetail
    // deleteChequeBookChequeBookDetail: builder.mutation<
    //   unknown,
    //   IDeleteChequeBookCommandsVM
    // >({
    //   query: (objToDelete: IDeleteChequeBookCommandsVM) => ({
    //     url: 'deleteChequeBookChequeBookDetail',
    //     method: 'POST',
    //     body: objToDelete,
    //   }),
    //   invalidatesTags: ['chequeBookGrid', 'chequeBookDetailGrid'],
    // }),
    // cancelChequeBookDetail: builder.mutation<
    //   unknown,
    //   ICancelChequeBookDetailCommand
    // >({
    //   query: (objToCancel: ICancelChequeBookDetailCommand) => ({
    //     url: 'cancelChequeBookDetail',
    //     method: 'POST',
    //     body: objToCancel,
    //   }),
    //   invalidatesTags: ['chequeBookDetailGrid', 'chequeBookGrid'],
    // }),
    // approveChequeBook: builder.mutation<unknown, IApproveChequeBookCommandsVM>({
    //   query: (objToApprove: IApproveChequeBookCommandsVM) => ({
    //     url: 'approveChequeBook',
    //     method: 'POST',
    //     body: objToApprove,
    //   }),
    //   invalidatesTags: ['chequeBookDetailGrid', 'chequeBookGrid'],
    // }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAllTenderNoQuery,
  useGetProcurementTenderByTenderIdQuery,
  useGetProcurementTenderDetailByTenderIdQuery,
  useGetProcurementTenderAdditionalCostByTenderIdQuery,
  useGetPreviousTenderHistoryByDateRangeQuery,
  useProcessSaveTenderMutation,
  // useGetChequeBookByBankLeafNoQuery,
  // useGetChequeBookDetailByChequeBookIdQuery,
  // useCreateChequeBookMutation,
  // useUpdateChequeBookCreateChequeBookDetailMutation,
  // useDeleteChequeBookChequeBookDetailMutation,
  // useCancelChequeBookDetailMutation,
  // useApproveChequeBookMutation,
} = TenderApiSlice;
