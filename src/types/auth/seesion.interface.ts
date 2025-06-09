export interface SeesionGetALLResponse{

}


export interface SeesionRevokeAllRequest{
    excludeCurrentSession: string
}

export interface SeesionRevokeAllResponse{
    excludeCurrentSession: string
}

export interface SeesionRevokeRequest{
    sessionIds:[]
    deviceIds:[]
    excludeCurrentSession: string
}

export interface SeesionRevokeResponse{

}