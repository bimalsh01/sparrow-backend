const userService = require("../services/userService")

class UserController{
    async updateProfile(req,res){
        const {fname,lname,secondaryEmail,state, city} = req.body;
        console.log(fname,lname,secondaryEmail,state, city)
        
        const userId = req.body.id;
        console.log(userId);
        let user;
        try {
            user = await userService.findUser ({_id: userId});
            if(!user){
                res.status(404).json({message: "User not found"});
            }
            user.fname = fname;
            user.lname = lname;
            user.secondaryEmail = secondaryEmail;
            user.address = {
                state: state,
                city: city
            }
            
            user.save();
            res.send({message: "Profile updated successfully"});


        } catch (error) {
            res.send("Update Failed");
        }
    }
}

module.exports = new UserController;