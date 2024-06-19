import React, { useState, useEffect } from 'react';
import {
  Container,
  AppBar,
  Tabs,
  Tab,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Tooltip,
  TablePagination,
} from '@mui/material';
import { Add, Edit, Search, Delete, Restore } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import {
  useGetAllUserQuery,
  useSaveUserMutation,
  useDeleteUserMutation,
  useGetAllUserCountQuery,
} from '../../../infrastructure/api/UserApiSlice';
import {
  UserSaveRequestModel,
  UserResponseModel,
} from '../../../domain/interfaces/UserResponseModel';
import { saveLastRoute } from '../../../application/Redux/slices/LastRouteSlice';
import { useAppDispatch } from '../../../application/Redux/store/store';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

type Props = {};

const UserManagement = (props: Props) => {
  const [tabValue, setTabValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSaveRequestModel | null>(
    null
  );
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const { control, handleSubmit, reset } = useForm<UserSaveRequestModel>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [pageSize, setPageSize] = useState(10);
  const [activePage, setActivePage] = useState(0);
  const [inactivePage, setInactivePage] = useState(0);

  const dispatch = useAppDispatch();
  const location = useLocation();
  dispatch(saveLastRoute({ from: location.pathname }));

  const activeQuery = useGetAllUserQuery({
    searchModel: {
      columnFilter: [
        {
          columnName: 'active',
          columnValue: ['1'],
          columnValueType: 'number',
        },
      ],
      valueSearch: {
        searchValueType: 'string',
        searchValue: searchTerm,
        searchColumnList: ['userName', 'firstName', 'lastName', 'email'],
      },
    },
    page: activePage + 1,
    pageSize,
  });

  const inactiveQuery = useGetAllUserQuery({
    searchModel: {
      columnFilter: [
        {
          columnName: 'active',
          columnValue: ['0'],
          columnValueType: 'number',
        },
      ],
      valueSearch: {
        searchValueType: 'string',
        searchValue: searchTerm,
        searchColumnList: ['userName', 'firstName', 'lastName', 'email'],
      },
    },
    page: inactivePage + 1,
    pageSize,
  });

  const { data: activeCount } = useGetAllUserCountQuery({
    searchModel: {
      columnFilter: [
        {
          columnName: 'active',
          columnValue: ['1'],
          columnValueType: 'number',
        },
      ],
      valueSearch: {
        searchValueType: 'string',
        searchValue: searchTerm,
        searchColumnList: ['userName', 'firstName', 'lastName', 'email'],
      },
    },
    page: activePage + 1,
    pageSize,
  });

  const { data: inactiveCount } = useGetAllUserCountQuery({
    searchModel: {
      columnFilter: [
        {
          columnName: 'active',
          columnValue: ['0'],
          columnValueType: 'number',
        },
      ],
      valueSearch: {
        searchValueType: 'string',
        searchValue: searchTerm,
        searchColumnList: ['userName', 'firstName', 'lastName', 'email'],
      },
    },
    page: inactivePage + 1,
    pageSize,
  });

  const [saveUser] = useSaveUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  useEffect(() => {
    activeQuery.refetch();
    inactiveQuery.refetch();
  }, [searchTerm, tabValue, activePage, inactivePage, pageSize]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (user: UserSaveRequestModel | null) => {
    setSelectedUser(user);
    reset(
      user || {
        id: 0,
        userName: '',
        firstName: '',
        lastName: '',
        userTypeId: 1,
        email: '',
        phoneNumber: '',
        active: true,
        x: 0,
        y: 0,
      }
    );
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleConfirmDialogOpen = (userId: number) => {
    setDeleteUserId(userId);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDialogClose = () => {
    setDeleteUserId(null);
    setConfirmDialogOpen(false);
  };

  const onSubmit = async (data: UserSaveRequestModel) => {
    try {
      await saveUser(data).unwrap();
      toast.success('User saved successfully');
      activeQuery.refetch();
      inactiveQuery.refetch();
      handleCloseDialog();
    } catch (error) {
      toast.error('Error saving user');
    }
  };

  const handleDeleteUser = async () => {
    if (deleteUserId !== null) {
      try {
        await deleteUser(deleteUserId).unwrap();
        toast.success('User inactivated successfully');
        activeQuery.refetch();
        inactiveQuery.refetch();
        handleConfirmDialogClose();
      } catch (error) {
        toast.error('Error inactivating user');
      }
    }
  };

  const handleRevertUser = async (user: UserSaveRequestModel) => {
    try {
      await saveUser({ ...user, active: true }).unwrap();
      toast.success('User reactivated successfully');
      activeQuery.refetch();
      inactiveQuery.refetch();
    } catch (error) {
      toast.error('Error reactivating user');
    }
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    if (tabValue === 0) {
      setActivePage(newPage);
    } else {
      setInactivePage(newPage);
    }
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10));
    setActivePage(0);
    setInactivePage(0);
  };

  return (
    <Container className="mt-40">
      <AppBar position="static" color="default">
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Active Users" />
          <Tab label="Inactive Users" />
        </Tabs>
      </AppBar>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        my={2}
      >
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton>
                <Search />
              </IconButton>
            ),
          }}
        />
        {/* <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpenDialog(null)}
        >
          Add User
        </Button> */}
      </Box>
      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activeQuery.data?.data?.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(user)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="secondary"
                        onClick={() => handleConfirmDialogOpen(user.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={activeCount?.data || 0}
            rowsPerPage={pageSize}
            page={activePage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handlePageSizeChange}
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} of ${count}`
            }
            labelRowsPerPage="Rows per page"
          />
        </TableContainer>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inactiveQuery.data?.data?.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(user)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Reactivate">
                      <IconButton
                        color="primary"
                        onClick={() => handleRevertUser(user)}
                      >
                        <Restore />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={inactiveCount?.data || 0}
            rowsPerPage={pageSize}
            page={inactivePage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handlePageSizeChange}
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} of ${count}`
            }
            labelRowsPerPage="Rows per page"
          />
        </TableContainer>
      </TabPanel>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{selectedUser ? 'Edit User' : 'Add User'}</DialogTitle>
        <div className="mt-1">
          <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="userName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    label="Username"
                    fullWidth
                    variant="outlined"
                  />
                )}
              />
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    label="First Name"
                    fullWidth
                    variant="outlined"
                  />
                )}
              />
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    label="Last Name"
                    fullWidth
                    variant="outlined"
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="normal"
                    label="Email"
                    fullWidth
                    variant="outlined"
                  />
                )}
              />
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    margin="dense"
                    label="Phone Number"
                    fullWidth
                    variant="outlined"
                  />
                )}
              />
              <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">
                  Cancel
                </Button>
                <Button type="submit" color="primary">
                  Save
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </div>
      </Dialog>

      <Dialog open={confirmDialogOpen} onClose={handleConfirmDialogClose}>
        <DialogTitle>Confirm</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to proceed?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteUser} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement;
