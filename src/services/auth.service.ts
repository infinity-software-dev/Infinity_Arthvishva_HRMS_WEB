// src/services/auth.service.ts
import axios from "axios";
import { AUTH_API } from "@/constants/API/api";

export const authService = {
  loginHR: async (idCode: string, password: string) => {
    const response = await axios.post(AUTH_API.LOGIN_HR, { idCode, password });
    return response.data;
  },
  loginDirector: async (idCode: string, password: string) => {
    const response = await axios.post(AUTH_API.LOGIN_DIRECTOR, { idCode, password });

    return response.data;
  },
  loginEmployee: async (employeeCode: string, password: string) => {
    const response = await axios.post(AUTH_API.LOGIN_EMPLOYEE, { employeeCode, password });
    return response.data;
  },
};