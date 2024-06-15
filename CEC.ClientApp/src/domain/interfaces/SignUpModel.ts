export interface SignUpRequestModel {
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  userTypeId: number;
  password: string;
  confirmPassword: string;
  x: number | null;
  y: number | null;
}
