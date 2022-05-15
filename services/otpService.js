const crypto = require('crypto');
const hashService = require('./hashService');

class otpService{
    async generateOtp(){
        const otp = crypto.randomInt(1000,9000);
        return otp;
    }

    async sendOtp(phone,otp){
        try {
            // return await twilio.messages.create({
            //     to: phone,
            //     from: process.env.SMS_FROM,
            //     body: `Your verification code is ${otp}. Don't share this code with anyone | Voice Corp.`
            // });
            console.log(otp);
            
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
