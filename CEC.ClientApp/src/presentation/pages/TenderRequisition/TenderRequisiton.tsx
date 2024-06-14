/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/ban-types */
// import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import ProcurementTender from './ProcurementTender/ProcurementTender';
import ProcurementTenderAdditionalCost from './ProcurementTenderAdditionalCost/ProcurementTenderAdditionalCost';

import { IFormProps } from '../../../domain/interfaces/FormPropsInterface';
import {
  ICreateProcurementTenderCommand,
  IProcurementTender,
  IProcurementTenderProcessCommandsVM,
  ITenderNoComboBox,
  IUpdateProcurementTenderCommand,
} from '../../../domain/interfaces/ProcurementTenderInterface';
import {
  ICreateProcurementTenderAdditionalCostCommand,
  IDeleteProcurementTenderAdditionalCostCommand,
  IProcurementTenderAdditionalCost,
  IUpdateProcurementTenderAdditionalCostCommand,
} from '../../../domain/interfaces/ProcurementTenderAdditionalCost';
import {
  ICreateProcurementTenderDetailCommand,
  IDeleteProcurementTenderDetailCommand,
  IProcurementTenderDetail,
  IUpdateProcurementTenderDetailCommand,
} from '../../../domain/interfaces/ProcurementTenderDetailInterface';
import ProcurementTenderDetail from './ProcurementTenderDetail/ProcurementTenderDetail';
import { useProcessSaveTenderMutation } from '../../../infrastructure/api/TenderApiSlice';

type Props = {};

const TenderRequisiton = (props: Props) => {
  const {
    register,
    getValues,
    reset,
    control,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    // defaultValues: {
    //   bank: null,
    // },
    mode: 'onBlur', // Validation will trigger on blur
  });

  const formProps: IFormProps = {
    register,
    getValues,
    reset,
    control,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    trigger,
    errors,
  };

  const [tenderInfo, setTenderInfo] = useState<ITenderNoComboBox | null>(null);

  // -------------------[procurement tender states]-------------------
  const [procurementTenderState, setProcurementTenderState] =
    useState<IProcurementTender | null>(null);
  const [procurementTenderPrevState, setProcurementTenderPrevState] =
    useState<IProcurementTender | null>(null);

  // -------------------[procurement detail states]-------------------

  const [procurementTenderDetailState, setProcurementTenderDetailState] =
    useState<IProcurementTenderDetail[]>([]);
  const [
    procurementTenderDetailStatePrev,
    setProcurementTenderDetailStatePrev,
  ] = useState<IProcurementTenderDetail[]>([]);
  const [
    deletedRowProcurementTenderDetail,
    setDeletedRowProcurementTenderDetail,
  ] = useState<IDeleteProcurementTenderDetailCommand[]>([]);

  // -------------------[procurement Additional cost states]-------------------
  const [
    procurementTenderAdditionalCostState,
    setProcurementTenderAdditionalCostState,
  ] = useState<IProcurementTenderAdditionalCost[]>([]);
  const [
    procurementTenderAdditionalCostStatePrev,
    setProcurementTenderAdditionalCostStatePrev,
  ] = useState<IProcurementTenderAdditionalCost[]>([]);
  const [
    deletedRowProcurementTenderAdditionalCost,
    setDeletedRowProcurementTenderAdditionalCost,
  ] = useState<IDeleteProcurementTenderAdditionalCostCommand[]>([]);

  // ------------------------------[API hooks]-----------------------------------

  const [
    processSaveTender,
    {
      isLoading: processSaveTenderIsLoading,
      isError: processSaveTenderIsError,
      error: processSaveTenderError,
      isSuccess: processSaveTenderIsSuccess,
      data: processSaveTenderData,
    },
  ] = useProcessSaveTenderMutation();

  useEffect(() => {
    // if (!processSaveTenderIsLoading) {
    //   // loading kisu dekha
    //   setLoaderSpinner(true);
    // } else {
    //   setLoaderSpinner(false);
    // }

    if (processSaveTenderIsSuccess) {
      // setLoaderSpinnerForThisPage(false);
      Swal.fire({
        title: `Tender has been saved successfully!`,
        text: '',
        showDenyButton: false,
        allowOutsideClick: false,
        // target: 'body',
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'OK!',
        // denyButtonText: `No, I will set it manually!`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          // modalPageOpenerClose();
          console.log('check data after success, see console---->');
          console.log(processSaveTenderData);
          if (tenderInfo?.procurementTenderId) {
            setTenderInfo({ ...tenderInfo });
          } else {
            setTenderInfo({
              procurementTenderId:
                processSaveTenderData?.procurementTenderId || 0,
              tenderNo: processSaveTenderData?.tenderNo || '',
            });
          }
        }
      });
    } else if (processSaveTenderIsError) {
      // setLoaderSpinnerForThisPage(false);
      toast.error(
        'Something is wrong in backend while saving Tender data, see console---->'
      );
      console.log(
        'Something is wrong in backend while saving Tender data, see console---->'
      );
      console.log(processSaveTenderError);
    }
  }, [
    processSaveTenderIsLoading,
    processSaveTenderIsError,
    processSaveTenderData,
    processSaveTenderError,
    processSaveTenderIsSuccess,
  ]);

  // ------------------------------[functions]------------------------------

  const procurementTenderProcessing = () => {
    // -----------------[ProcurementTender Processing]--------------------

    let createProcurementTenderCommand: ICreateProcurementTenderCommand | null =
      null;
    let updateProcurementTenderCommand: IUpdateProcurementTenderCommand | null =
      null;

    const prevProcurementTender: IProcurementTender | null =
      procurementTenderPrevState
        ? JSON.parse(JSON.stringify(procurementTenderPrevState))
        : null;

    const currentProcurementTender: IProcurementTender | null = {
      procurementTenderId: procurementTenderState?.procurementTenderId || 0,
      tenderNo: procurementTenderState?.tenderNo || null,
      tenderEntryDate: `${dayjs(getValues('tenderEntryDate')).format(
        'YYYY-MM-DD'
      )}T${dayjs(getValues('tenderEntryDate')).format('HH:mm')}:00`,
      buyerId: getValues('buyer')?.buyerId || null,
      buyerName: getValues('buyer')?.buyerName || null,
      bgAmount: parseFloat(getValues('bgAmount')) || null,
      // salesPersonId: getValues('salesPerson').salesPersonId,
      // salesPersonName: getValues('salesPerson').salesPersonName,
      salesPersonId: procurementTenderState?.salesPersonId || null,
      salesPersonName: procurementTenderState?.salesPersonName || null,
      remarks: getValues('remarks'),
      tenderSubmissionDate: `${dayjs(getValues('tenderSubmissionDate')).format(
        'YYYY-MM-DD'
      )}T${dayjs(getValues('tenderSubmissionDate')).format('HH:mm')}:00`,
      schedulePrice: parseFloat(getValues('schedulePrice')),
    };

    // const currentProcurementTender: IProcurementTender | null =
    //   procurementTenderState
    //     ? JSON.parse(JSON.stringify(procurementTenderState))
    //     : null;

    console.log('maal gula dekhe ne---->');
    console.log('prevProcurementTender---->');
    console.log(prevProcurementTender);
    console.log(JSON.stringify(prevProcurementTender));

    console.log('currentProcurementTender---->');
    console.log(currentProcurementTender);
    console.log(JSON.stringify(currentProcurementTender));

    console.log('boolean---->');
    console.log(
      JSON.stringify(prevProcurementTender) ===
        JSON.stringify(currentProcurementTender)
    );

    const noChangeInProcurementTender =
      JSON.stringify(prevProcurementTender) ===
      JSON.stringify(currentProcurementTender);

    if (
      !tenderInfo?.procurementTenderId &&
      !noChangeInProcurementTender &&
      currentProcurementTender &&
      currentProcurementTender?.buyerId
    ) {
      createProcurementTenderCommand = {
        procurementTenderId: 0,
        tenderNo: null,
        tenderEntryDate: currentProcurementTender.tenderEntryDate
          ? (currentProcurementTender.tenderEntryDate as string)
          : null,
        buyerId: currentProcurementTender.buyerId,
        bgAmount: currentProcurementTender.bgAmount
          ? currentProcurementTender.bgAmount
          : null,
        salesPersonId: currentProcurementTender.salesPersonId
          ? currentProcurementTender.salesPersonId
          : null,
        remarks: currentProcurementTender.remarks
          ? currentProcurementTender.remarks
          : null,
        tenderSubmissionDate: currentProcurementTender.tenderSubmissionDate
          ? currentProcurementTender.tenderSubmissionDate
          : null,
        schedulePrice: currentProcurementTender.schedulePrice
          ? currentProcurementTender.schedulePrice
          : null,
      };
    } else if (
      tenderInfo?.procurementTenderId &&
      !noChangeInProcurementTender &&
      currentProcurementTender &&
      currentProcurementTender?.buyerId
    ) {
      updateProcurementTenderCommand = {
        procurementTenderId: tenderInfo.procurementTenderId,
        tenderNo: tenderInfo.tenderNo,
        tenderEntryDate: currentProcurementTender.tenderEntryDate
          ? (currentProcurementTender.tenderEntryDate as string)
          : null,
        buyerId: currentProcurementTender.buyerId,
        bgAmount: currentProcurementTender.bgAmount
          ? currentProcurementTender.bgAmount
          : null,
        salesPersonId: currentProcurementTender.salesPersonId
          ? currentProcurementTender.salesPersonId
          : null,
        remarks: currentProcurementTender.remarks
          ? currentProcurementTender.remarks
          : null,
        tenderSubmissionDate: currentProcurementTender.tenderSubmissionDate
          ? currentProcurementTender.tenderSubmissionDate
          : null,
        schedulePrice: currentProcurementTender.schedulePrice
          ? currentProcurementTender.schedulePrice
          : null,
      };
    }

    return {
      createProcurementTenderCommand,
      updateProcurementTenderCommand,
    };
    // -----------------[----DONE----  ProcurementTender Processing ----DONE----]--------------------
  };
  const procurementTenderDetailProcessing = () => {
    // -----------------[ProcurementTenderDetail Processing]--------------------

    const createProcurementTenderDetailCommand: ICreateProcurementTenderDetailCommand[] =
      [];
    const updateProcurementTenderDetailCommand: IUpdateProcurementTenderDetailCommand[] =
      [];
    const deleteProcurementTenderDetailCommand: IDeleteProcurementTenderDetailCommand[] =
      [...deletedRowProcurementTenderDetail];

    const prevProcurementTenderDetail: IProcurementTenderDetail[] = JSON.parse(
      JSON.stringify(procurementTenderDetailStatePrev)
    );
    let currentProcurementTenderDetail: IProcurementTenderDetail[] = JSON.parse(
      JSON.stringify(procurementTenderDetailState)
    );
    const deletedProcurementDetailRows: IDeleteProcurementTenderDetailCommand[] =
      JSON.parse(JSON.stringify(deletedRowProcurementTenderDetail));
    // loading naame ekta property add korsilam, oita muisa ditesi
    currentProcurementTenderDetail = currentProcurementTenderDetail.map(
      (obj) => {
        // eslint-disable-next-line no-param-reassign
        delete obj.loading;
        return obj;
      }
    );

    // eliminating all faka dummy rows
    currentProcurementTenderDetail = currentProcurementTenderDetail.filter(
      (obj) => Object.values(obj).some((val) => val)
    );

    prevProcurementTenderDetail.sort(
      (a, b) =>
        (a.procurementTenderDetailId ?? 0) - (b.procurementTenderDetailId ?? 0)
    );

    console.log(
      '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Current Procurement Tender detail!!!!!!!!!!!!!!!!!!!!!!!!'
    );
    console.log(currentProcurementTenderDetail);

    const rowsWithId: IProcurementTenderDetail[] = [];

    for (let i = 0; i < currentProcurementTenderDetail.length; i++) {
      // jegulay primaryKey id nai, oigula sure to create
      if (!currentProcurementTenderDetail[i].procurementTenderDetailId) {
        const tempObj: ICreateProcurementTenderDetailCommand = {
          // procurementTenderDetailId: 0,
          procurementTenderId: tenderInfo?.procurementTenderId
            ? tenderInfo?.procurementTenderId
            : null,
          productGroupId: currentProcurementTenderDetail[i].productGroupId || 0,
          productId: currentProcurementTenderDetail[i].productId || 0,
          quantity: currentProcurementTenderDetail[i].quantity || null,
          price: currentProcurementTenderDetail[i].price || null,
          initialFactor:
            currentProcurementTenderDetail[i].initialFactor || null,
        };
        createProcurementTenderDetailCommand.push(tempObj);
      } else {
        rowsWithId.push(currentProcurementTenderDetail[i]);
      }
    }

    // ekhon deleted aar id wala rows ekshathe mishaya sort dibo, then compare korbo, compare e jodi equal na hoy tahole abar if diye check korbo oder primaryId baade j kono ekta mandatory field e value ase naki(jehetu delete er gulay shudhu primaryId ase), jodi thake then rowToUpdate e dhukabo

    const withIdandDeletedrows: any = [
      ...currentProcurementTenderDetail,
      ...deletedProcurementDetailRows,
    ];
    withIdandDeletedrows.sort(
      (a: any, b: any) =>
        (a.procurementTenderDetailId ?? 0) - (b.procurementTenderDetailId ?? 0)
    );

    for (let i = 0; i < withIdandDeletedrows.length; i++) {
      const prevRow = JSON.stringify(prevProcurementTenderDetail[i]);
      const gridRow = JSON.stringify(withIdandDeletedrows[i]);

      if (prevRow !== gridRow) {
        if (
          withIdandDeletedrows[i].procurementTenderDetailId &&
          (withIdandDeletedrows[i].productGroupId ||
            withIdandDeletedrows[i].productId ||
            withIdandDeletedrows[i].quantity)
        ) {
          const tempObjUpdate: IUpdateProcurementTenderDetailCommand = {
            procurementTenderDetailId:
              withIdandDeletedrows[i].procurementTenderDetailId || 0,
            procurementTenderId: tenderInfo?.procurementTenderId || 0,
            productGroupId: withIdandDeletedrows[i].productGroupId || 0,
            productId: withIdandDeletedrows[i].productId || 0,
            quantity: withIdandDeletedrows[i].quantity || null,
            price: withIdandDeletedrows[i].price || null,
            initialFactor: withIdandDeletedrows[i].initialFactor || null,
          };
          updateProcurementTenderDetailCommand.push(tempObjUpdate);
        }
      }
    }
    return {
      createProcurementTenderDetailCommand,
      updateProcurementTenderDetailCommand,
      deleteProcurementTenderDetailCommand,
    };
    // -----------------[----DONE----ProcurementTenderDetail Processing  ----DONE----]--------------------
  };
  const procurementTenderAdditionalCostProcessing = () => {
    // -----------------[ProcurementTenderAdditionalCost Processing]--------------------

    const createProcurementTenderAdditionalCostCommand: ICreateProcurementTenderAdditionalCostCommand[] =
      [];
    const updateProcurementTenderAdditionalCostCommand: IUpdateProcurementTenderAdditionalCostCommand[] =
      [];
    const deleteProcurementTenderAdditionalCostCommand: IDeleteProcurementTenderAdditionalCostCommand[] =
      [...deletedRowProcurementTenderAdditionalCost];

    const prevProcurementTenderAdditionalCost: IProcurementTenderAdditionalCost[] =
      JSON.parse(JSON.stringify(procurementTenderAdditionalCostStatePrev));

    let currentProcurementTenderAdditionalCost: IProcurementTenderAdditionalCost[] =
      JSON.parse(JSON.stringify(procurementTenderAdditionalCostState));

    const deletedProcurementAdditionalCostRows: IDeleteProcurementTenderAdditionalCostCommand[] =
      JSON.parse(JSON.stringify(deletedRowProcurementTenderAdditionalCost));

    // eliminating all faka dummy rows
    currentProcurementTenderAdditionalCost =
      currentProcurementTenderAdditionalCost.filter((obj) =>
        Object.values(obj).some((val) => val)
      );

    prevProcurementTenderAdditionalCost.sort(
      (a, b) =>
        (a.procurementTenderAdditionalCostId ?? 0) -
        (b.procurementTenderAdditionalCostId ?? 0)
    );

    const rowsWithId: IProcurementTenderAdditionalCost[] = [];

    console.log('currentProcurementTenderAdditionalCost-------------->');
    console.log(currentProcurementTenderAdditionalCost);

    for (let i = 0; i < currentProcurementTenderAdditionalCost.length; i++) {
      // jegulay primaryKey id nai, oigula sure to create
      if (
        !currentProcurementTenderAdditionalCost[i]
          .procurementTenderAdditionalCostId
      ) {
        const tempObj: ICreateProcurementTenderAdditionalCostCommand = {
          // procurementTenderAdditionalCostId: 0,
          procurementTenderId: tenderInfo?.procurementTenderId
            ? tenderInfo?.procurementTenderId
            : null,

          name: currentProcurementTenderAdditionalCost[i].name || '',
          description: currentProcurementTenderAdditionalCost[i].description,
          accountsId: currentProcurementTenderAdditionalCost[i].accountsId,
          percentage: currentProcurementTenderAdditionalCost[i].percentage || 0,
          amount: currentProcurementTenderAdditionalCost[i].amount,
        };
        createProcurementTenderAdditionalCostCommand.push(tempObj);
      } else {
        rowsWithId.push(currentProcurementTenderAdditionalCost[i]);
      }
    }

    // ekhon deleted aar id wala rows ekshathe mishaya sort dibo, then compare korbo, compare e jodi equal na hoy tahole abar if diye check korbo oder primaryId baade j kono ekta mandatory field e value ase naki(jehetu delete er gulay shudhu primaryId ase), jodi thake then rowToUpdate e dhukabo

    const withIdandDeletedrows: any = [
      ...currentProcurementTenderAdditionalCost,
      ...deletedProcurementAdditionalCostRows,
    ];
    withIdandDeletedrows.sort(
      (a: any, b: any) =>
        (a.procurementTenderAdditionalCostId ?? 0) -
        (b.procurementTenderAdditionalCostId ?? 0)
    );

    for (let i = 0; i < withIdandDeletedrows.length; i++) {
      const prevRow = JSON.stringify(prevProcurementTenderAdditionalCost[i]);
      const gridRow = JSON.stringify(withIdandDeletedrows[i]);

      if (prevRow !== gridRow) {
        if (
          withIdandDeletedrows[i].procurementTenderAdditionalCostId &&
          (withIdandDeletedrows[i].name ||
            withIdandDeletedrows[i].description ||
            withIdandDeletedrows[i].accountsId)
        ) {
          const tempObjUpdate: IUpdateProcurementTenderAdditionalCostCommand = {
            procurementTenderAdditionalCostId:
              withIdandDeletedrows[i].procurementTenderAdditionalCostId,
            procurementTenderId: tenderInfo?.procurementTenderId || 0,
            name: withIdandDeletedrows[i].name || '',
            description: withIdandDeletedrows[i].description || null,
            accountsId: withIdandDeletedrows[i].accountsId || null,
            percentage: withIdandDeletedrows[i].percentage || 0,
            amount: withIdandDeletedrows[i].amount || 0,
          };
          updateProcurementTenderAdditionalCostCommand.push(tempObjUpdate);
        }
      }
    }
    return {
      createProcurementTenderAdditionalCostCommand,
      updateProcurementTenderAdditionalCostCommand,
      deleteProcurementTenderAdditionalCostCommand,
    };
    // -----------------[----DONE----ProcurementTenderAdditionalCost Processing  ----DONE----]--------------------
  };
  const processAllDataAndSave = () => {
    console.log('save button clicked');

    const x = procurementTenderProcessing();
    const y = procurementTenderDetailProcessing();
    const z = procurementTenderAdditionalCostProcessing();

    console.log('ProcurementTenderProcessing');
    console.log(x);
    console.log('ProcurementTenderProcessing Create----->>>');
    console.log('ProcurementTenderProcessing Update----->>>');

    console.log('procurementTenderDetailProcessing');
    console.log(y);
    console.log('procurementTenderDetailProcessing Create----->>>');
    console.log('procurementTenderDetailProcessing Update----->>>');
    console.log('procurementTenderDetailProcessing delete----->>>');

    console.log('procurementTenderAdditionalCostProcessing');
    console.log(z.createProcurementTenderAdditionalCostCommand);
    console.log('procurementTenderAdditionalCostProcessing Create----->>>');
    console.log('procurementTenderAdditionalCostProcessing Update----->>>');
    console.log('procurementTenderAdditionalCostProcessing Delete----->>>');

    const objToSend: IProcurementTenderProcessCommandsVM = {
      createProcurementTenderCommand:
        procurementTenderProcessing().createProcurementTenderCommand,
      updateProcurementTenderCommand:
        procurementTenderProcessing().updateProcurementTenderCommand,
      deleteProcurementTenderCommand: null,
      createProcurementTenderDetailCommand:
        procurementTenderDetailProcessing()
          .createProcurementTenderDetailCommand,
      updateProcurementTenderDetailCommand:
        procurementTenderDetailProcessing()
          .updateProcurementTenderDetailCommand,
      deleteProcurementTenderDetailCommand:
        procurementTenderDetailProcessing()
          .deleteProcurementTenderDetailCommand,
      createProcurementTenderAdditionalCostCommand:
        procurementTenderAdditionalCostProcessing()
          .createProcurementTenderAdditionalCostCommand,
      updateProcurementTenderAdditionalCostCommand:
        procurementTenderAdditionalCostProcessing()
          .updateProcurementTenderAdditionalCostCommand,
      deleteProcurementTenderAdditionalCostCommand:
        procurementTenderAdditionalCostProcessing()
          .deleteProcurementTenderAdditionalCostCommand,
    };
    console.log('Obj to send Finally haha see--------->>');
    console.log(objToSend);

    if (areAllPropertiesFalsy(objToSend)) {
      toast.error('No changes has been made!');
      return false;
    }

    processSaveTender(objToSend);
  };

  function isEmpty(value: any) {
    if (value === null || value === undefined) {
      return true;
    }
    if (Array.isArray(value) && value.length === 0) {
      return true;
    }
    if (typeof value === 'object' && Object.keys(value).length === 0) {
      return true;
    }
    return false;
  }

  function areAllPropertiesFalsy(obj: any) {
    return Object.values(obj).every(isEmpty);
  }
  return (
    // return wrapper div
    <div className="mt-16 md:mt-2">
      <div className="m-2 flex justify-center">
        <div className="block w-11/12 ">
          {/* Main Card */}
          <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg text-center">
            {/* Main Card header */}
            <div className="py-3 bg-gray-100 text-slate-800 text-[14px] font-bold shadow-2xl dark:text-gray-200 text-start px-6 border-b border-gray-300">
              {/* -----[Laboratory experimental place starts here]----- */}
              Tender Requisition
              {/* ---//--[Laboratory experimental place ENDS here]----- */}
            </div>
            {/* Main Card header--/-- */}

            {/* Main Card body */}
            <div className=" px-6 text-start  mt-2">
              <div className="mx-1 mt-1">
                <ProcurementTender
                  procurementTenderState={procurementTenderState}
                  setProcurementTenderState={setProcurementTenderState}
                  procurementTenderPrevState={procurementTenderPrevState}
                  setProcurementTenderPrevState={setProcurementTenderPrevState}
                  tenderInfo={tenderInfo}
                  setTenderInfo={setTenderInfo}
                  formProps={formProps}
                />
              </div>
              <div className="mx-1 mt-1">
                <ProcurementTenderDetail
                  tenderInfo={tenderInfo}
                  setTenderInfo={setTenderInfo}
                  procurementTenderDetailState={procurementTenderDetailState}
                  setProcurementTenderDetailState={
                    setProcurementTenderDetailState
                  }
                  procurementTenderDetailStatePrev={
                    procurementTenderDetailStatePrev
                  }
                  setProcurementTenderDetailStatePrev={
                    setProcurementTenderDetailStatePrev
                  }
                  deletedRowProcurementTenderDetail={
                    deletedRowProcurementTenderDetail
                  }
                  setDeletedRowProcurementTenderDetail={
                    setDeletedRowProcurementTenderDetail
                  }
                  formProps={formProps}
                />
              </div>

              {}
              <div className="mx-1 mt-1">
                <ProcurementTenderAdditionalCost
                  tenderInfo={tenderInfo}
                  setTenderInfo={setTenderInfo}
                  procurementTenderAdditionalCostState={
                    procurementTenderAdditionalCostState
                  }
                  setProcurementTenderAdditionalCostState={
                    setProcurementTenderAdditionalCostState
                  }
                  procurementTenderAdditionalCostStatePrev={
                    procurementTenderAdditionalCostStatePrev
                  }
                  setProcurementTenderAdditionalCostStatePrev={
                    setProcurementTenderAdditionalCostStatePrev
                  }
                  deletedRowProcurementTenderAdditionalCost={
                    deletedRowProcurementTenderAdditionalCost
                  }
                  setDeletedRowProcurementTenderAdditionalCost={
                    setDeletedRowProcurementTenderAdditionalCost
                  }
                  formProps={formProps}
                />
              </div>
            </div>
            {/* Main Card Body--/-- */}

            {/* Main Card footer */}
            <div className="py-3 px-6 border-t text-start border-gray-300 text-gray-600">
              <div className="flex gap-x-3">
                <button
                  type="button"
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="light"
                  className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                  onClick={() => {
                    processAllDataAndSave();
                  }}
                >
                  Save
                </button>
              </div>
            </div>
            {/* Main Card footer--/-- */}
          </div>
          {/* Main Card--/-- */}
        </div>
      </div>

      {/* // modals --- out of html normal body/position */}

      {/* --------------------------[Making a loader modal]--------------------------------------- */}

      {/* // modals --- out of html normal body/position */}
    </div>
    // return wrapper div--/--
  );
};

export default TenderRequisiton;
