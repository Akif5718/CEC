export interface UserResponseModel {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  aspnetUserId: string;
  userTypeId: number;
  email: string;
  phoneNumber: string;
  active: boolean;
  x: number;
  y: number;
}

export interface UserSaveRequestModel {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  userTypeId: number;
  email: string;
  phoneNumber: string;
  active: boolean;
  x: number;
  y: number;
}
