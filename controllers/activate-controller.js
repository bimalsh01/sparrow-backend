const userService = require("../services/userService")
const userDto = require("../dtos/userDto");
const bcrypt = require("bcrypt");

class ActivateController{
    async activate(req,res){
        const saltPassword = await bcrypt.genSaltSync(10);
        const securePassword = await bcrypt.hash(req.body.password, saltPassword);
        const {username} = req.body;

        const userId = req.body.userId;
        let user;
        

        try {
            user = await userService.findUser({_id: userId});
            if(!user){
                res.status(404).json({message: "user not found"});
            }
            user.activated = true;
            user.username = username;
            user.password = securePassword;
            user.save();

        } catch (error) {
            console.log(error);
            return res.status(500).send({message: 'Error OCCURED BRO'});
        }

        res.json({user: new userDto(user), Auth:true});
        return;
    }
}

module.exports = new ActivateController();