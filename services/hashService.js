const crypto = require('crypto');

class hashService{
    hashOtp(data){
        const hash = crypto.createHash('sha256').update(data).digest('hex');
        return hash;
    }
}

module.exports = new hashService();