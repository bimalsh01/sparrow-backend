const crypto = require('crypto');
const hashService = require('./hashService');

const smsId = process.env.SMS_ID
const smsAuth = process.env.SMS_AUTH
const twilio = require('twilio')(smsId,smsAuth,{
    lazyLoading: true
})


class otpService{
    async generateOtp(){
        const otp = crypto.randomInt(1000,9000);
        return otp;
    }

    async sendOtp(phone,otp){
        try {
            console.log(otp);
            return await twilio.messages.create({
                to: `+977 ${phone}`,
                from: process.env.SMS_FROM,
                body: `Your verification code is ${otp}. Don't share this code with anyone | Sparrow Corp.`
            });
            
            
        } catch (err) {
            console.log(err);
        }
    }

    async verifyOtp(hashedOtp,data){
        let newHash = hashService.hashOtp(data);
        if(newHash == hashedOtp){
            console.log("Otp is valid");
            return true;
        }
        return false;
    }
}

module.exports = new otpService();
