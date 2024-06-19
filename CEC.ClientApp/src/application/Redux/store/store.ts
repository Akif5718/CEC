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

    [AccountApiSlice.reducerPath]: AccountApiSlice.reducer,
    [SearchApiSlice.reducerPath]: SearchApiSlice.reducer,
    [UserApiSlice.reducerPath]: UserApiSlice.reducer,
    [FavouriteApiSlice.reducerPath]: FavouriteApiSlice.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
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
