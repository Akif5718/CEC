/* eslint-disable jsx-a11y/control-has-associated-label */
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
// import Sample from '../pages/Sample/Sample';
import './App.css';

import { FiSettings } from 'react-icons/fi';
import {
  Box,
  Fade,
  Modal,
  ThemeProvider,
  Tooltip,
  createTheme,
} from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { lazy, Suspense } from 'react';
import Sidebar from '../components/Sidebar';
import {
  useAppDispatch,
  useAppSelector,
} from '../../application/Redux/store/store';
import {
  IIsClicked,
  setAllFeatureIsClicked,
} from '../../application/Redux/slices/IsClickedSlice';
import {
  falsifyThemeSettings,
  truthifyThemeSettings,
} from '../../application/Redux/slices/ThemeSettingsSlice';
import { falsifyActiveMenu } from '../../application/Redux/slices/ActiveMenuSlice';

import ThemeSettings from '../components/ThemeSettings';
// import BiznessEventProcConfig from '../pages/BiznessEventProcConfig/BiznessEventProcConfig';
import Navbar from '../components/Navbar';
import { useGetSAChainMenuByCompanyLocationUserIdQuery } from '../../infrastructure/api/SAChainMenuApiSlice';
// import Laboratory from '../pages/Laboratory/Laboratory';
import CostSheetDetail from '../pages/CostSheetDetail/CostSheetDetail';
// import Login from '../pages/Login/LoginUsernameLayer';
import PrivateRoute from './PrivateRoute';

import Home from '../pages/Home/Home';
// import ForgotPassword from '../pages/Login/ForgotPasswordCompanyLocationSelect';

import ChequeBookRegistration from '../pages/ChequeBookRegistration/ChequeBookRegistration';

import SearchPage from '../pages/SearchPage/SearchPage';
import SignUp from '../pages/Login/SignUp/SignUp';
import SignIn from '../pages/Login/SignIn/SignIn';
// import SignIn from '../pages/Login/SignIn';
// const Navbar = lazy(() => import('../components/Navbar'));
// const ThemeSettings = lazy(() => import('../components/ThemeSettings'));

// import StructuredPageTSSample from '../pages/StructuredPageTSSample/StructuredPageTSSample';

// const LazyBiznessEventProcConfigPrev = lazy(
//   () => import('../pages/BiznessEventProcConfig/BiznessEventProcConfig')
// );

// const LazyBiznessEventProcConfig = lazy(
//   () =>
//     import(
//       '../pages/BiznessEventProcessConfiguration/BiznessEventProcessConfiguration'
//     )
// );

const App = () => {
  const activeMenu = useAppSelector((state) => state.activeMenu.active);
  const showPanel = useAppSelector((state) => state.showPanel.bool);
  const showNavbar = useAppSelector((state) => state.showNavbar.bool);
  const currentMode = useAppSelector((state) => state.currentMode.mode);
  const themeSettings = useAppSelector((state) => state.themeSettings.bool);
  const screenSize = useAppSelector((state) => state.screenSize.size);

  const dispatch = useAppDispatch();

  const hideAllOpened = () => {
    const initialState: IIsClicked = {
      chat: false,
      cart: false,
      userProfile: false,
      notification: false,
    };

    // setThemeSettings(false);
    dispatch(falsifyThemeSettings());
    // setIsClicked(initialState);
    dispatch(setAllFeatureIsClicked({ obj: initialState }));
    // // console.log("function e dhukse");
    // if (activeMenu && screenSize && screenSize <= 900) {
    //   //  setActiveMenu(false);
    //   dispatch(falsifyActiveMenu());
    // }
  };

  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <ThemeProvider
        theme={createTheme({
          palette: {
            mode: currentMode === 'Dark' ? 'dark' : 'light',
          },
        })}
      >
        <BrowserRouter>
          {/* --the most super background DIV on which everything is situated---STARTS- */}
          <div className="flex  relative dark:bg-main-dark-bg">
            {/* --Settings Icon & button-- STARTS--- */}
            <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
              <Tooltip
                title="Settings"
                placement="top-start"
                style={{ zIndex: 9999 }}
                arrow
              >
                <button
                  type="button"
                  aria-label="Settings"
                  onClick={() => {
                    // setThemeSettings(true)
                    dispatch(truthifyThemeSettings());
                  }}
                  className="text-2xl p-3 hover:drop-shadow-2xl hover:scale-110 transform-all duration-300 hover:transform-all hover:bg-light-gray text-white"
                  style={{ background: 'blue', borderRadius: '50%' }}
                >
                  <FiSettings />
                </button>
              </Tooltip>
            </div>
            {/* --Settings Icon & button--ENDS--- */}

            {/* --Sidebar depending on 'activeMenu' var--  */}
            {/* {activeMenu ? (
              <div
                className={`w-72 fixed sidebar drop-shadow-lg bg-white dark:bg-secondary-dark-bg transition-all duration-300 ${
                  showPanel ? '' : 'hidden'
                }`}
                id="sidebarDiv"
              >
                <Sidebar />
              </div>
            ) : (
              <div
                className={`transition-all duration-300 w-0 drop-shadow-2xl  bg-white dark:bg-secondary-dark-bg ${
                  showPanel ? '' : 'hidden'
                }`}
              >
                <Sidebar />
              </div>
            )} */}
            {/* --Sidebar depending on 'activeMenu' var--ENDS----  */}

            {/* --All Routes declaration and main background starts--STARTS----  */}
            <div
              // className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full
              //           ${activeMenu && showPanel ? 'md:ml-72' : 'flex-2'}`}
              className="dark:bg-main-dark-bg bg-main-bg min-h-screen w-full"
            >
              <div
                className={`fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ${
                  showNavbar ? '' : 'hidden'
                }`}
              >
                <Navbar />
              </div>

              <div>
                {themeSettings && <ThemeSettings />}
                {/* --declaring routes of components/pages--  */}
                <div
                  onClick={() => hideAllOpened()}
                  onKeyDown={() => hideAllOpened()}
                  role="button"
                  tabIndex={0}
                >
                  <Suspense fallback={<h1>LOADING............HAHA</h1>}>
                    <Routes>
                      {/* <Route
                        path="/"
                        element={<PrivateRoute element={<Home />} />}
                      /> */}
                      <Route path="/" element={<Home />} />
                      <Route path="signIn" element={<SignIn />} />
                      <Route path="signUp" element={<SignUp />} />

                      {/* <Route
                        path="home"
                        element={<PrivateRoute element={<Home />} />}
                      /> */}

                      <Route path="home" element={<Home />} />
                      {/* <Route
                        path="searchPage/:id"
                        element={<PrivateRoute element={<SearchPage />} />}
                      /> */}
                      <Route path="searchPage" element={<SearchPage />} />
                    </Routes>
                  </Suspense>
                </div>
              </div>
            </div>
            {/* --All Routes declaration and main background starts--ENDS----  */}
          </div>
          {/* --the most super background DIV on which everything is situated---ENDS- */}
        </BrowserRouter>

        <ToastContainer
          theme="colored"
          position="bottom-right"
          autoClose={3000}
          pauseOnHover
          draggable
          closeOnClick
          hideProgressBar={false}
          newestOnTop={false}
          pauseOnFocusLoss
          style={{ zIndex: 999999999999 }}
        />
      </ThemeProvider>
    </div>
  );
};

export default App;
