exports.email2FA = (otp) =>{
    return `Dear User,\n`
    + `${otp} is your otp for Login. Please Enter the OTP to proceed.\n`
    + `Regards\n`
    + `Seekright IMS`
}

exports.resetPass = (otp) =>{
    return `Dear User,\n`
    + `${otp} is your otp for Reset Password. Please Enter the OTP to proceed.\n`
    + `Regards\n`
    + `Seekright IMS`
}

exports.emailVerification = (otp) =>{
    return `Dear User,\n`
    + `${otp} is your otp for verification. Please enter the OTP to verify your email.\n`
    + `Regards\n`
    + `Seekright IMS`
}


