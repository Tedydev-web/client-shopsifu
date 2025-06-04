
export interface RequestDeviceResponse{
    statusCode: string
    message: string
    data:{
        requiresDeviceVerification: string
        verificationType: string
        verificationRedirectUrl: string
    }
}


// {
//     "statusCode": 200,
//     "message": "OTP verification successful.",
//     "data": {
//         "id": 4,
//         "email": "nguyendangphat1505@gmail.com",
//         "role": "CLIENT",
//         "isDeviceTrustedInSession": false,
//         "userProfile": {
//             "id": 3,
//             "firstName": "Shopsifu",
//             "lastName": "ecommerce",
//             "username": "nguyendangphat1",
//             "avatar": null,
//             "bio": null,
//             "phoneNumber": "0987614582",
//             "isPhoneNumberVerified": false,
//             "phoneNumberVerifiedAt": null,
//             "countryCode": null,
//             "userId": 4,
//             "createdAt": "2025-06-03T15:30:33.605Z",
//             "updatedAt": "2025-06-03T15:30:33.605Z"
//         }
//     }
// }


export interface VerifyCodeLoginResponse{

}