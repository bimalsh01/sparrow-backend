const userModel = require("../models/user-model");

class userService{
    async findUser(filter){
        const user = await userModel.findOne(filter);
        return user;
    }
    
    async createUser(data){
        const user = await userModel.create(data);
        return user;
    }

    async comparePassword(filter){
        const dbPassword = await userModel.findOne(filter);
        console.log(dbPassword);
        try {
            if(dbPassword == password){
                return true;
            }
            return true;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new userService();