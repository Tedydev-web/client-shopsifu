import { BaseResponse, PaginationRequest } from "../base.interface"

export interface SessionGetALLResponse  extends BaseResponse, PaginationRequest{
    data: {
        devices: {
            deviceId: number,
            name: string,
            type: string,
            os: string,
            osVer: string,
            browser: string,
            browserVer: string,
            trusted: boolean,
            trustExp: string | null,
            lastActive: string,
            location: string,
            activeSessions: number,
            totalSessions: number,
            isCurrent: boolean,
            status: string,
            riskLevel: string,
            daysSinceLastUse: number,
            sessions: { 
               id: string,
               createdAt: string,
               lastActive: string,
               ip: string,
               location: string,
               browser: string,
               browserVer: string,
               app: string,
               os: string,
               osVer: string,
               type: string,
               active: boolean,
               inactiveDuration: string,
               isCurrent: boolean
            }
        }    
    },
}


export interface SessionRevokeAllRequest extends BaseResponse{ 
    excludeCurrentSession?: string
}

export interface SessionRevokeAllResponse extends BaseResponse{
    excludeCurrentSession?: string
}

export interface SessionRevokeRequest extends BaseResponse{
    sessionIds?:string[]
    deviceIds?:number[]
    excludeCurrentSession?: string
}

export interface SessionRevokeResponse extends BaseResponse {
    excludeCurrentSession?: string
}