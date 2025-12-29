export interface SendOtpRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface OtpData {
  otp: string;
  createdAt: number;
  attempts: number;
}
