import { postJson } from "@/src/services/api";
import type {
  ApiResponse,
  LoginInput,
  RegisterInput,
  User,
} from "@/src/types/auth";

// creates the account only; the user still has to log in
export const register = (input: RegisterInput) =>
  postJson<ApiResponse<{ data: User }>>("/auth/register", input);

// sets the accessToken and refreshToken cookies; the body carries only the user
export const login = (input: LoginInput) =>
  postJson<ApiResponse<{ user: User }>>("/auth/login", input);

// trades the refreshToken cookie for a new 15-minute accessToken cookie
export const refreshToken = () => postJson<ApiResponse>("/auth/refreshToken");

// clears both cookies and revokes this session on the server
export const logout = () => postJson<ApiResponse>("/auth/logout");
