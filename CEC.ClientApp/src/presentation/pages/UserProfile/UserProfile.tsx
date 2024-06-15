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
  useGetUserByIdMutation,
  useSaveUserMutation,
} from '../../../infrastructure/api/UserApiSlice';
import { toast } from 'react-toastify';
import {
  UserResponseModel,
  UserSaveRequestModel,
} from '../../../domain/interfaces/UserResponseModel';

// Define the user model type

const initialUser: UserResponseModel = {
  id: 0,
  firstName: '',
  lastName: '',
  email: '',
  userName: '',
  x: 12.9209, // Example latitude
  y: 50.8282, // Example longitude
  aspnetUserId: '',
  userTypeId: 2,
  phoneNumber: '',
  active: true,
};

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<UserResponseModel>(initialUser);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const mapRef = useRef<L.Map | null>(null); // Ref to access the MapContainer instance
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
      // Handle error state
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
      // Handle error state
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
    // Add save logic here (e.g., API call to save the user data)
  };

  const handleDelete = () => {
    // Add delete logic here (e.g., API call to delete the user account)
    console.log('User account deleted');
    setOpen(false);
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
            label="Latitude"
            value={user.x}
            InputProps={{ readOnly: true }}
            variant="filled"
            fullWidth
          />
          <TextField
            label="Longitude"
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
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
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
          onClick={handleClickOpen}
          sx={{ mt: 2 }}
        >
          Delete Account
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{'Delete Account'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserProfile;

// import React, { useState } from 'react';
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   IconButton,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// // Define the user model type
// interface UserModel {
//   firstName: string;
//   lastName: string;
//   email: string;
//   userName: string;
//   x: number;
//   y: number;
// }

// // Initial user data
// const initialUser: UserModel = {
//   firstName: 'John',
//   lastName: 'Doe',
//   email: 'john.doe@example.com',
//   userName: 'johnnyD',
//   x: 51.505, // Example latitude
//   y: -0.09, // Example longitude
// };

// const UserProfile: React.FC = () => {
//   const [user, setUser] = useState<UserModel>(initialUser);
//   const [isEditing, setIsEditing] = useState<boolean>(false);
//   const [open, setOpen] = useState<boolean>(false);

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = event.target;
//     setUser({ ...user, [name]: value });
//   };

//   const handleEdit = () => {
//     setIsEditing(true);
//   };

//   const handleSave = () => {
//     // Add save logic here (e.g., API call to save the user data)
//     setIsEditing(false);
//   };

//   const handleDelete = () => {
//     // Add delete logic here (e.g., API call to delete the user account)
//     console.log('User account deleted');
//     setOpen(false);
//   };

//   const MarkerSetter = () => {
//     useMapEvents({
//       click(e) {
//         if (isEditing) {
//           setUser({
//             ...user,
//             x: e.latlng.lat,
//             y: e.latlng.lng,
//           });
//         }
//       },
//     });
//     return null;
//   };

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   return (
//     <Box
//       sx={{
//         width: '100%',
//         maxWidth: 600,
//         margin: 'auto',
//         mt: 5,
//         p: 3,
//         boxShadow: 3,
//         borderRadius: 2,
//         bgcolor: 'background.paper',
//         position: 'relative',
//       }}
//     >
//       <IconButton
//         onClick={handleEdit}
//         sx={{ position: 'absolute', top: 16, right: 16 }}
//       >
//         <EditIcon />
//       </IconButton>
//       <Typography variant="h4" gutterBottom>
//         User Profile
//       </Typography>
//       <Box
//         component="form"
//         sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
//       >
//         <Box sx={{ display: 'flex', gap: 2 }}>
//           <TextField
//             label="First Name"
//             name="firstName"
//             value={user.firstName}
//             onChange={handleChange}
//             disabled={!isEditing}
//             fullWidth
//           />
//           <TextField
//             label="Last Name"
//             name="lastName"
//             value={user.lastName}
//             onChange={handleChange}
//             disabled={!isEditing}
//             fullWidth
//           />
//         </Box>
//         <TextField
//           label="Email"
//           value={user.email}
//           InputProps={{ readOnly: true }}
//           variant="filled"
//         />
//         <TextField
//           label="Username"
//           value={user.userName}
//           InputProps={{ readOnly: true }}
//           variant="filled"
//         />
//         <Typography variant="h6" gutterBottom>
//           Home Address
//         </Typography>
//         <Box sx={{ display: 'flex', gap: 2 }}>
//           <TextField
//             label="Latitude"
//             value={user.x}
//             InputProps={{ readOnly: true }}
//             variant="filled"
//             fullWidth
//           />
//           <TextField
//             label="Longitude"
//             value={user.y}
//             InputProps={{ readOnly: true }}
//             variant="filled"
//             fullWidth
//           />
//         </Box>
//         <Box sx={{ height: 400, mt: 2 }}>
//           <MapContainer
//             center={[user.x, user.y]}
//             zoom={13}
//             style={{ height: '100%', width: '100%' }}
//             scrollWheelZoom={false}
//           >
//             <TileLayer
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//               attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//             />
//             <Marker position={[user.x, user.y]} />
//             {isEditing && <MarkerSetter />}
//           </MapContainer>
//         </Box>
//         {isEditing && (
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleSave}
//             sx={{ mt: 2 }}
//           >
//             Save
//           </Button>
//         )}
//         <Button
//           variant="outlined"
//           color="error"
//           onClick={handleClickOpen}
//           sx={{ mt: 2 }}
//         >
//           Delete Account
//         </Button>
//       </Box>

//       <Dialog open={open} onClose={handleClose}>
//         <DialogTitle>{'Delete Account'}</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to delete your account? This action cannot be
//             undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={handleDelete} color="error">
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default UserProfile;
