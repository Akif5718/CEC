import { useEffect, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { FiShoppingCart } from 'react-icons/fi';
import { BsChatLeft } from 'react-icons/bs';
import { RiNotification3Line } from 'react-icons/ri';
import { MdKeyboardArrowDown } from 'react-icons/md';

import { Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import avatar from '../assets/data/avatar.jpg';
import logo from '../assets/data/brand-logo.png';
import Cart from './Cart';
import Chat from './Chat';
import Notification from './Notification';
import UserProfile from './UserProfile';

import {
  useAppDispatch,
  useAppSelector,
} from '../../application/Redux/store/store';
import { changeScreenSize } from '../../application/Redux/slices/ScreenSizeSlice';
import {
  falsifyActiveMenu,
  toggleActiveMenu,
  truthifyActiveMenu,
} from '../../application/Redux/slices/ActiveMenuSlice';
import { toggleACertainFeatureClick } from '../../application/Redux/slices/IsClickedSlice';
import {
  falsifyShowNavbar,
  truthifyShowNavbar,
} from '../../application/Redux/slices/ShowNavbarSlice';

interface NavButtonProps {
  title?: string;
  customFunc?: () => void; // Custom function, optional
  icon?: React.ReactNode; // Material-UI icon component
  color?: string;
  dotColor?: string;
}

const NavButton: React.FC<NavButtonProps> = ({
  title,
  customFunc,
  icon,
  color,
  dotColor,
}) => (
  <Tooltip title={title} placement="bottom" arrow>
    <button
      type="button"
      onClick={customFunc}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray hover:scale-110 transform-gpu focus:shadow-lg focus:outline-none focus:ring-0 active:-translate-y-2 active:shadow-lg tranform-all duration-300"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </Tooltip>
);

const Navbar = () => {
  // const {
  //   activeMenu,
  //   setActiveMenu,
  //   isClicked,
  //   setIsClicked,
  //   handleClick,
  //   screenSize,
  //   setScreenSize,
  //   currentColor,
  // } = useStateContext();

  // const activeMenu = useAppSelector((state) => state.activeMenu.active);
  // const showPanel = useAppSelector((state) => state.showPanel.bool);
  const showNavbar = useAppSelector((state) => state.showNavbar.bool);
  // const currentMode = useAppSelector((state) => state.currentMode.mode);
  // const themeSettings = useAppSelector((state) => state.themeSettings.bool);
  const screenSize = useAppSelector((state) => state.screenSize.size);
  const isClicked = useAppSelector((state) => state.isClicked);
  const currentColor = useAppSelector((state) => state.currentColor.color);
  const dispatch = useAppDispatch();

  let userInfo;
  const jsonUserInfo = localStorage.getItem('userInfo');
  if (jsonUserInfo) {
    userInfo = JSON.parse(jsonUserInfo);
  }

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      dispatch(changeScreenSize({ size: window.innerWidth }));
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [scrollNavbarShow, setScrollNavbarShow] = useState(true);
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setScrollNavbarShow(false);
      } else {
        setScrollNavbarShow(true);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // useEffect(() => {
  //   if (screenSize && screenSize <= 900) {
  //     // setActiveMenu(false);
  //     dispatch(falsifyActiveMenu());
  //   } else {
  //     // setActiveMenu(true);
  //     dispatch(truthifyActiveMenu());
  //   }
  // }, [screenSize]);

  return (
    <div
      className={`flex z-[100000000] justify-between p-2 bg-[#010E2C] shadow-md backdrop-blur fixed top-0 w-full bg transition-transform duration-500 ${
        scrollNavbarShow && showNavbar ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div
        className="ml-10 flex items-center"
        onClick={() => {
          navigate(`/`);
        }}
      >
        <img src={logo} alt="Brand Logo" className="h-16 w-16" />{' '}
        {/* Logo container */}
        <h3 className="ml-4 text-white cursor-pointer">Care Edu Compass</h3>
      </div>

      <div className="flex justify-end items-center">
        {userInfo?.userId ? (
          <Tooltip title="Profile" placement="bottom" arrow>
            <div
              className="flex items-center gap-2 cursor-pointer p-1 focus:shadow-lg focus:outline-none focus:ring-0 active:-translate-y-1 active:shadow-lg hover:bg-light-gray hover:scale-105 transform-gpu tranform-all duration-300 rounded-lg"
              role="button"
              tabIndex={0}
              onKeyDown={() => {
                dispatch(
                  toggleACertainFeatureClick({ propertyName: 'userProfile' })
                );
              }}
              onClick={() => {
                dispatch(
                  toggleACertainFeatureClick({ propertyName: 'userProfile' })
                );
              }}
            >
              <img
                alt="userProfilePic"
                className="rounded-full w-8 h-8"
                src={avatar}
              />
              <p>
                <span className="text-gray-400 text-14">Hi, </span>

                <span className="text-gray-400 font-bold ml-1 text-14">
                  {userInfo?.userName ? userInfo.userName : 'Anonymous'}
                </span>
              </p>
              <MdKeyboardArrowDown className="text-gray-400 text-14" />
            </div>
          </Tooltip>
        ) : (
          <button
            type="button"
            data-mdb-ripple="true"
            data-mdb-ripple-color="light"
            className="inline-block px-6 py-1 mx-4 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
            onClick={() => {
              navigate(`/signIn`);
            }}
          >
            Sign In
          </button>
        )}

        {isClicked.cart && <Cart />}
        {isClicked.chat && <Chat />}
        {isClicked.notification && <Notification />}
        {isClicked.userProfile && <UserProfile />}
      </div>
    </div>
  );
};

export default Navbar;
