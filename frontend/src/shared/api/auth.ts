import {
  authControllerGetMe,
  authControllerLogin,
  authControllerLogout,
  authControllerRefresh,
  authControllerRegister,
} from "./generated/auth/auth";
import type { LoginDto, RegisterDto, UserEntity } from "./generated/types";
import { httpClient } from "./http-client";

export const login = (loginDto: LoginDto): Promise<UserEntity> =>
  authControllerLogin(loginDto, {}, httpClient);

export const register = (registerDto: RegisterDto): Promise<UserEntity> =>
  authControllerRegister(registerDto, {}, httpClient);

export const logout = (): Promise<void> => authControllerLogout({}, httpClient);

export const getMe = (): Promise<UserEntity> =>
  authControllerGetMe({}, httpClient);

export const refresh = (): Promise<UserEntity> =>
  authControllerRefresh({}, httpClient);
