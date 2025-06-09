import { publicAxios, privateAxios, refreshAxios } from '@/lib/api';
import {
    SeesionGetALLResponse,
    SeesionRevokeAllRequest,
    SeesionRevokeAllResponse,
    SeesionRevokeRequest,
    SeesionRevokeResponse
 } from '@/types/auth/seesion.interface'
import { API_ENDPOINTS } from '@/constants/api';
import { AxiosError } from "axios";