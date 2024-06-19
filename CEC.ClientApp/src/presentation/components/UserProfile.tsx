/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

// import Swal from 'sweetalert2';

import {
  Autocomplete,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Modal,
  TextField,
  Tooltip,
} from '@mui/material';
import { BsCurrencyDollar, BsShield } from 'react-icons/bs';
import SettingsIcon from '@mui/icons-material/Settings';
import { FiCreditCard } from 'react-icons/fi';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../../public/apiConfig.json';
import avatar from '../assets/data/avatar.jpg';
import Button2 from './Button';
import {
  useAppDispatch,
  useAppSelector,
} from '../../application/Redux/store/store.js';
import {
  IIsClicked,
  setAllFeatureIsClicked,
} from '../../application/Redux/slices/IsClickedSlice.js';
import { ILocationDto } from '../../domain/interfaces/UserInfoInterface.js';
import { useChangePasswordMutation } from '../../infrastructure/api/AccountApiSlice.js';
import { ChangeUserPasswordModel } from '../../domain/interfaces/ChangeUserPasswordModel.js';

const UserProfile = () => {
  //   const { currentColor } = useStateContext();
  const [userProfileEditModalOpen, setUserProfileEditModalOpen] =
    useState(false);
  const currentColor = useAppSelector((state) => state.currentColor.color);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  //   const { setIsClicked, initialState } = useStateContext();
  const tempUserSession = localStorage.getItem('userInfo');
  const userSession = tempUserSession ? JSON.parse(tempUserSession) : '';
  const lastSavedRoute = useAppSelector((state) => state.lastRoute.from);
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
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [openChangePassword, setOpenChangePassword] = useState<boolean>(false);
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  const logoutBtn = () => {
    const initialState: IIsClicked = {
      chat: false,
      cart: false,
      userProfile: false,
      notification: false,
    };

    // setIsClicked(initialState);
    dispatch(setAllFeatureIsClicked({ obj: initialState }));

    if (localStorage.getItem('userInfo') || localStorage.getItem('brFeature')) {
      localStorage.removeItem('userInfo');
      localStorage.removeItem('brFeature');
    }
    // navigate(`${lastSavedRoute || '/'}`);
    navigate('/');
  };

  let userInfo: any;
  const jsonUserInfoTemp = localStorage.getItem('userInfo');
  if (jsonUserInfoTemp) {
    userInfo = JSON.parse(jsonUserInfoTemp);
  }

  const [userAllInfo, setUserAllInfo] = useState([]);
  const handleUserManagementClick = () => {
    navigate('/userManagement');
  };

  const userProfileData = {
    icon: <SettingsIcon />,
    title: 'My Profile',
    desc: 'Account Settings',
    iconColor: '#03C9D7',
    iconBg: '#E5FAFB',
    onClickFunc: () => {
      navigate('/userProfile');
    },
  };
  const handleChangePasswordClickOpen = () => {
    setOpenChangePassword(true);
  };

  const handleChangePasswordClose = () => {
    setOpenChangePassword(false);
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    const jsonUserInfo = localStorage.getItem('userInfo');
    if (jsonUserInfo) {
      const userInfo = JSON.parse(jsonUserInfo);
      if (userInfo && userInfo.userName) {
        const changePasswordRequest: ChangeUserPasswordModel = {
          UserName: userInfo.userName,
          OldPassword: oldPassword,
          Password: newPassword,
          ConfirmPassword: confirmPassword,
        };

        try {
          const response = await changePassword(changePasswordRequest).unwrap();
          if (response.data) {
            // toast.success('Password changed successfully');
            setOpenChangePassword(false);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
          } else {
            toast.error('Failed to change password');
          }
        } catch (error) {
          toast.error('Failed to change password');
        }
      }
    }
  };
  return (
    <div className="nav-item z-[1000000] absolute right-1 top-16 bg-slate-100 border backdrop-blur-3xl dark:bg-[#42464D] p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">User Profile</p>
        <Button2
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
        />
      </div>
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        <img
          className="rounded-full h-24 w-24"
          src={avatar}
          alt="user-profile"
        />
        <div></div>
      </div>
      {userSession.userType == 'Admin' ? (
        <>
          <div
            onClick={handleUserManagementClick}
            className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]"
          >
            <button
              type="button"
              style={{
                color: userProfileData.iconColor,
                backgroundColor: userProfileData.iconBg,
              }}
              className=" text-xl rounded-lg p-3 hover:bg-light-gray"
            >
              <PeopleIcon />
            </button>
            <div>
              <p className="font-semibold dark:text-gray-200 ">
                User Management
              </p>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                {' '}
                Manage Users
              </p>
            </div>
          </div>
          <div
            onClick={handleChangePasswordClickOpen}
            className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]"
          >
            <button
              type="button"
              style={{
                color: userProfileData.iconColor,
                backgroundColor: userProfileData.iconBg,
              }}
              className=" text-xl rounded-lg p-3 hover:bg-light-gray"
            >
              <VpnKeyIcon />
            </button>
            <div>
              <p className="font-semibold dark:text-gray-200 ">
                Change Password
              </p>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                {' '}
                Password
              </p>
            </div>
          </div>
        </>
      ) : (
        <div
          key={uuidv4()}
          onClick={userProfileData.onClickFunc}
          className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]"
        >
          <button
            type="button"
            style={{
              color: userProfileData.iconColor,
              backgroundColor: userProfileData.iconBg,
            }}
            className=" text-xl rounded-lg p-3 hover:bg-light-gray"
          >
            {userProfileData.icon}
          </button>

          <div>
            <p className="font-semibold dark:text-gray-200 ">
              {userProfileData.title}
            </p>
            <p className="text-gray-500 text-sm dark:text-gray-400">
              {' '}
              {userProfileData.desc}{' '}
            </p>
          </div>
        </div>
      )}
      <div className="mt-5">
        <button
          type="button"
          onClick={() => logoutBtn()}
          style={{
            backgroundColor: currentColor,
            color: 'white',
            borderRadius: '10px',
          }}
          className="transform-all duration-300 hover:scale-105 transform-gpu focus:shadow-lg focus:outline-none focus:ring-0 active:-translate-y-1 active:shadow-lg p-3 w-full hover:drop-shadow-xl"
        >
          Logout
        </button>
      </div>

      {/* // modals -----start----- out of html normal body/position */}

      {/* Making a loader modal */}
      <Modal
        open={false}
        // onClose={handleClose}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000000000,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '95vw', // Set the width of the modal to full screen
            height: '95vh', // Set the height of the modal to full screen
            backgroundColor: 'rgba(251, 255, 255, 0)',
            overflow: 'hidden',
          }}
          className="voucherGenModal"
        >
          <div className="flex justify-center ">
            <div className="mt-[350px] bg-transparent">
              <div className="mt-10 ml-[-50px] px-3 text-left text-white bg-slate-700 rounded-full">
                Please Wait a bit...
              </div>
            </div>
          </div>
        </Box>
      </Modal>
      {/* // modals -----end----- out of html normal body/position */}
      {/* Change Password Dialog */}
      <Dialog open={openChangePassword} onClose={handleChangePasswordClose}>
        <DialogTitle>{'Change Password'}</DialogTitle>
        <div className=" mt-1">
          <DialogContent>
            <TextField
              autoFocus
              margin="normal"
              label="Old Password"
              type="password"
              fullWidth
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <TextField
              margin="normal"
              label="New Password"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              margin="normal"
              label="Confirm New Password"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </DialogContent>
        </div>

        <DialogActions>
          <Button onClick={handleChangePasswordClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handlePasswordChange}
            color="secondary"
            disabled={isChangingPassword}
          >
            {isChangingPassword ? 'Changing...' : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default UserProfile;
