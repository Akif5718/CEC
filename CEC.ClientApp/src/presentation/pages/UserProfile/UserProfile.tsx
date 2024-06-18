import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  useDeleteUserMutation,
  useGetUserByIdMutation,
  useSaveUserMutation,
} from '../../../infrastructure/api/UserApiSlice';
import { useChangePasswordMutation } from '../../../infrastructure/api/AccountApiSlice';
import { toast } from 'react-toastify';
import {
  UserResponseModel,
  UserSaveRequestModel,
} from '../../../domain/interfaces/UserResponseModel';
import { ChangeUserPasswordModel } from '../../../domain/interfaces/ChangeUserPasswordModel';

const initialUser: UserResponseModel = {
  id: 0,
  firstName: '',
  lastName: '',
  email: '',
  userName: '',
  x: 12.9209,
  y: 50.8282,
  aspnetUserId: '',
  userTypeId: 2,
  phoneNumber: '',
  active: true,
};

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<UserResponseModel>(initialUser);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [openChangePassword, setOpenChangePassword] = useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const mapRef = useRef<L.Map | null>(null);
  const [deleteUser] = useDeleteUserMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();
  const [
    saveUser,
    {
      isLoading: isSaveUserLoading,
      isError: isSaveUserError,
      isSuccess: isSaveUserSuccess,
      data: saveUserResponse,
    },
  ] = useSaveUserMutation();

  useEffect(() => {
    if (isSaveUserSuccess && saveUserResponse && saveUserResponse.data) {
      toast.success('User info has been updated successfully');
    } else if (isSaveUserError) {
      toast.error('An error occurred');
    }
  }, [isSaveUserLoading, isSaveUserError, isSaveUserSuccess, saveUserResponse]);

  const [
    fetchUserById,
    {
      isLoading: isUserByIdLoading,
      isError: isUserByIdError,
      isSuccess: isUserByIdSuccess,
      data: userByIdResponse,
    },
  ] = useGetUserByIdMutation();

  useEffect(() => {
    if (isUserByIdSuccess && userByIdResponse && userByIdResponse.data) {
      setUser(userByIdResponse.data);
    } else if (isUserByIdError) {
      toast.error('An error occurred');
    }
  }, [isUserByIdLoading, isUserByIdError, isUserByIdSuccess, userByIdResponse]);

  useEffect(() => {
    const jsonUserInfo = localStorage.getItem('userInfo');
    if (jsonUserInfo) {
      const userInfo = JSON.parse(jsonUserInfo);
      if (userInfo && userInfo.userId) {
        fetchUserById(userInfo.userId);
      }
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const jsonUserInfo = localStorage.getItem('userInfo');
    if (jsonUserInfo) {
      const userInfo = JSON.parse(jsonUserInfo);
      setIsEditing(false);
      saveUser({
        id: userInfo.userId,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        userTypeId: user.userTypeId,
        email: user.email,
        phoneNumber: user.phoneNumber,
        active: user.active,
        x: user.x,
        y: user.y,
      });
    }
  };

  const handleDelete = async () => {
    const jsonUserInfo = localStorage.getItem('userInfo');
    if (jsonUserInfo) {
      const userInfo = JSON.parse(jsonUserInfo);
      if (userInfo && userInfo.userId) {
        await deleteUser(userInfo.userId).unwrap();
        console.log('User account deleted');
        setOpenDelete(false);
      }
    }
  };

  const MarkerSetter = () => {
    useMapEvents({
      click(e) {
        if (isEditing) {
          setUser({
            ...user,
            x: e.latlng.lng,
            y: e.latlng.lat,
          });
        }
      },
    });
    return null;
  };

  const handleDeleteClickOpen = () => {
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
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
    <Box
      sx={{
        width: '100%',
        maxWidth: 600,
        margin: 'auto',
        mt: 15,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
        position: 'relative',
      }}
    >
      <IconButton
        onClick={handleEdit}
        sx={{ position: 'absolute', top: 16, right: 16 }}
      >
        <EditIcon />
      </IconButton>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      <Box
        component="form"
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="First Name"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            disabled={!isEditing}
            fullWidth
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            disabled={!isEditing}
            fullWidth
          />
        </Box>
        <TextField
          label="Email"
          value={user.email}
          InputProps={{ readOnly: true }}
          variant="filled"
        />
        <TextField
          label="Username"
          value={user.userName}
          InputProps={{ readOnly: true }}
          variant="filled"
        />
        <Typography variant="h6" gutterBottom>
          Home Address
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Longitude"
            value={user.x}
            InputProps={{ readOnly: true }}
            variant="filled"
            fullWidth
          />
          <TextField
            label="Latitude"
            value={user.y}
            InputProps={{ readOnly: true }}
            variant="filled"
            fullWidth
          />
        </Box>
        <Box sx={{ height: 400, mt: 2 }}>
          <MapContainer
            center={[user.y, user.x]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[user.y, user.x]} />
            {isEditing && <MarkerSetter />}
          </MapContainer>
        </Box>
        {isEditing && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{ mt: 2 }}
          >
            Save
          </Button>
        )}
        <Button
          variant="outlined"
          color="error"
          onClick={handleDeleteClickOpen}
          sx={{ mt: 2 }}
        >
          Delete Account
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleChangePasswordClickOpen}
          sx={{ mt: 2 }}
        >
          Change Password
        </Button>
      </Box>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={openDelete} onClose={handleDeleteClose}>
        <DialogTitle>{'Delete Account'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
};

export default UserProfile;
