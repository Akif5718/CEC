/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../../../public/apiConfig.json';

// Helper function to check if the token is expired
const isTokenExpired = (token: string): boolean => {
  const decodedToken: any = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
};

// Function to refresh token
// const refreshToken = async (): Promise<string> => {
//   const refreshedToken = localStorage.getItem('refreshToken');
//   // if (!refreshedToken) throw new Error('No refresh token available');

//   const response = await fetch(`${API_BASE_URL}/api/refresh-token`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ refreshedToken }),
//   });

//   if (!response.ok) {
//     throw new Error('Failed to refresh token');
//   }

//   const data = await response.json();
//   localStorage.setItem('jwt', data.token);
//   localStorage.setItem('refreshToken', data.refreshToken);
//   return data.token;
// };

// Function to get the token, refresh if needed
export const getToken = async (): Promise<string | null> => {
  let userInfo: any;
  const jsonUserInfo = localStorage.getItem('userInfo');
  if (jsonUserInfo) {
    userInfo = JSON.parse(jsonUserInfo);
  }
  const token = userInfo?.userToken || '';

  if (token && isTokenExpired(token)) {
    toast.error('Token expired');
    try {
      // token = await refreshToken();
    } catch (error) {
      // console.error('Failed to refresh token', error);
      // Handle token refresh failure, e.g., logout user
      localStorage.removeItem('userInfo');
      // localStorage.removeItem('refreshToken');
      return null;
    }
  } else if (!token) {
    toast.error('No Token Found!');
  }

  return token;
};
