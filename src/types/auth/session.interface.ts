import { BaseResponse } from "../base.interface"

export interface SessionGetALLResponse  extends BaseResponse {
    data: {
        devices: {
            deviceId: string
            deviceName: string
            deviceType: string
            os: string
            osVersion: string
            browser: string
            browserVersion: string
            isDeviceTrusted: boolean
            deviceTrustExpiration: string | null
            lastActive: string
            location: string
            activeSessionsCount: number
            isCurrentDevice: boolean
            sessions: { 
                id: string
                createdAt: string
                lastActive: string
                ipAddress: string
                location: string
                browser: string
                browserVersion: string
                app: string
                os: string
                osVersion: string
                deviceType: string
                isActive: boolean
                inactiveDuration: string
                isCurrentSession: boolean
            }
        }    
    },
}


export interface SessionRevokeAllRequest extends BaseResponse{ 
    excludeCurrentSession: string
}

export interface SessionRevokeAllResponse extends BaseResponse{
    excludeCurrentSession: string
}

export interface SessionRevokeRequest extends BaseResponse{
    sessionIds:[]
    deviceIds:[]
    excludeCurrentSession: string
}

export interface SessionRevokeResponse extends BaseResponse {
    excludeCurrentSession: string
}