import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { PersonSlice } from '../slices/PersonSlice';
import { ActiveMenuSlice } from '../slices/ActiveMenuSlice';
import { CurrentColorSlice } from '../slices/CurrentColorSlice';
import { ScreenSizeSlice } from '../slices/ScreenSizeSlice';
import { ShowPanelSlice } from '../slices/ShowPanelSlice';
import { ThemeSettingsSlice } from '../slices/ThemeSettingsSlice';
import { CurrentModeSlice } from '../slices/CurrentModeSlice';
import { ShowNavbarSlice } from '../slices/ShowNavbarSlice';
import { IsClickedSlice } from '../slices/IsClickedSlice';
import { LastRouteSlice } from '../slices/LastRouteSlice';

import { fixedTaskTemplateApi } from '../../../infrastructure/api/FixedTaskTemplateApiSlice';
import { BiznessEventProcessConfigurationApiSlice } from '../../../infrastructure/api/BiznessEventProcessConigurationApiSlice';
import { SAChainMenuApiSlice } from '../../../infrastructure/api/SAChainMenuApiSlice';
import { SANextEventApiSlice } from '../../../infrastructure/api/SANextEventApiSlice';
import {
  // BiznessEventPCTrackVMApiSlice,
  BiznessEventPCTrackVMForJobHistoryApiSlice,
} from '../../../infrastructure/api/BiznessEventPCTrackVMForJobHistoryApiSlice';
import { BiznessEventPCTrackVMForTRLogApiSlice } from '../../../infrastructure/api/BiznessEventPCTrackVMForTRLogApiSlice';
import { CostSheetLCNoApiSlice } from '../../../infrastructure/api/CostSheetLCNoApiSlice';
import { TransactionAndCostingAmountApiSlice } from '../../../infrastructure/api/TransactionAndCostingAmountApiSlice';
import { LCVouchersForTransactionsApiSlice } from '../../../infrastructure/api/LCVouchersForTransactionsApiSlice';
import { CostSheetDetailApiSlice } from '../../../infrastructure/api/CostSheetDetailApiSlice';
import { AccountsNameApiSlice } from '../../../infrastructure/api/AccountsNameApiSlice';
import { GetBanksForChequeBookApi } from '../../../infrastructure/api/GetBanksForChequeBookApiSlice';
import { ChequeBookApiSlice } from '../../../infrastructure/api/ChequeBookApiSlice';
import { TenderApiSlice } from '../../../infrastructure/api/TenderApiSlice';
import { ProductApiSlice } from '../../../infrastructure/api/ProductApiSlice';
import { EmployeeApiSlice } from '../../../infrastructure/api/EmployeeApiSlice';
import { BuyerApiSlice } from '../../../infrastructure/api/BuyerApiSlice';
import { AccountApiSlice } from '../../../infrastructure/api/AccountApiSlice';
import { SearchApiSlice } from '../../../infrastructure/api/SearchApiSlice';
import { UserApiSlice } from '../../../infrastructure/api/UserApiSlice';
import { FavouriteApiSlice } from '../../../infrastructure/api/FavouriteApiSlice';

export const store = configureStore({
  reducer: {
    person: PersonSlice.reducer,
    activeMenu: ActiveMenuSlice.reducer,
    screenSize: ScreenSizeSlice.reducer,
    currentColor: CurrentColorSlice.reducer,
    currentMode: CurrentModeSlice.reducer,
    showPanel: ShowPanelSlice.reducer,
    showNavbar: ShowNavbarSlice.reducer,
    themeSettings: ThemeSettingsSlice.reducer,
    isClicked: IsClickedSlice.reducer,
    lastRoute: LastRouteSlice.reducer,
    [fixedTaskTemplateApi.reducerPath]: fixedTaskTemplateApi.reducer,
    [BiznessEventProcessConfigurationApiSlice.reducerPath]:
      BiznessEventProcessConfigurationApiSlice.reducer,
    [SAChainMenuApiSlice.reducerPath]: SAChainMenuApiSlice.reducer,
    [SANextEventApiSlice.reducerPath]: SANextEventApiSlice.reducer,
    [BiznessEventPCTrackVMForJobHistoryApiSlice.reducerPath]:
      BiznessEventPCTrackVMForJobHistoryApiSlice.reducer,
    [BiznessEventPCTrackVMForTRLogApiSlice.reducerPath]:
      BiznessEventPCTrackVMForTRLogApiSlice.reducer,
    [CostSheetLCNoApiSlice.reducerPath]: CostSheetLCNoApiSlice.reducer,
    [TransactionAndCostingAmountApiSlice.reducerPath]:
      TransactionAndCostingAmountApiSlice.reducer,
    [LCVouchersForTransactionsApiSlice.reducerPath]:
      LCVouchersForTransactionsApiSlice.reducer,
    [CostSheetDetailApiSlice.reducerPath]: CostSheetDetailApiSlice.reducer,
    [AccountsNameApiSlice.reducerPath]: AccountsNameApiSlice.reducer,
    [GetBanksForChequeBookApi.reducerPath]: GetBanksForChequeBookApi.reducer,
    [ChequeBookApiSlice.reducerPath]: ChequeBookApiSlice.reducer,
    [TenderApiSlice.reducerPath]: TenderApiSlice.reducer,
    [ProductApiSlice.reducerPath]: ProductApiSlice.reducer,
    [EmployeeApiSlice.reducerPath]: EmployeeApiSlice.reducer,
    [BuyerApiSlice.reducerPath]: BuyerApiSlice.reducer,
    [AccountApiSlice.reducerPath]: AccountApiSlice.reducer,
    [SearchApiSlice.reducerPath]: SearchApiSlice.reducer,
    [UserApiSlice.reducerPath]: UserApiSlice.reducer,
    [FavouriteApiSlice.reducerPath]: FavouriteApiSlice.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      fixedTaskTemplateApi.middleware,
      BiznessEventProcessConfigurationApiSlice.middleware,
      SAChainMenuApiSlice.middleware,
      SANextEventApiSlice.middleware,
      BiznessEventPCTrackVMForJobHistoryApiSlice.middleware,
      BiznessEventPCTrackVMForTRLogApiSlice.middleware,
      CostSheetLCNoApiSlice.middleware,
      TransactionAndCostingAmountApiSlice.middleware,
      LCVouchersForTransactionsApiSlice.middleware,
      CostSheetDetailApiSlice.middleware,
      AccountsNameApiSlice.middleware,
      GetBanksForChequeBookApi.middleware,
      ChequeBookApiSlice.middleware,
      TenderApiSlice.middleware,
      ProductApiSlice.middleware,
      EmployeeApiSlice.middleware,
      BuyerApiSlice.middleware,
      AccountApiSlice.middleware,
      SearchApiSlice.middleware,
      UserApiSlice.middleware,
      FavouriteApiSlice.middleware
    ),
});

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;

// const [activeMenu, setActiveMenu] = useState(undefined);
//     const [screenSize, setScreenSize] = useState(undefined);
//     const [currentColor, setCurrentColor] = useState('#1c64f2');
// const [showPanel, setShowPanel] = useState(true);
