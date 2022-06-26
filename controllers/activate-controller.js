const userService = require("../services/userService")
const userDto = require("../dtos/userDto");
const bcrypt = require("bcrypt");

class ActivateController{
    async activate(req,res){
        const saltPassword = bcrypt.genSaltSync(10);
        const securePassword = await bcrypt.hash(req.body.password, saltPassword);
        const {username} = req.body;

        const userId = req.user;
        let user;
        

        try {
            console.log("Hellooo");
            user = await userService.findUser({_id: userId});
            console.log(userId);
            if(!user){
                res.status(404).json({message: "user not found"});
                return;
            }

            user.activated = true;
            user.username = username;
            user.password = securePassword;
            user.save();

        } catch (error) {
            console.log(error);
            res.status(500).send({message: 'Error OCCURED BRO'});
            return;
        }

        res.json({user: new userDto(user), Auth:true});
        return;
    }
}

module.exports = new ActivateController();