export type SignupPayload = {
  email: string;
  password: string;
  full_name: string;
};

export type SignupResponse = {
  user_id: string;
  email: string;
  message: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};
