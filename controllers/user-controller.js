const userService = require("../services/userService")
const jimp = require('jimp');
const bcrypt = require("bcrypt");


class UserController{
    async updateProfile(req,res){
        const {fname,lname,secondaryEmail,state, city, profile} = req.body;
        console.log(fname,lname,secondaryEmail,state, city)
        
        const userId = req.body.id;
        console.log("This us user id")
        console.log(userId);

        

        const buffer = Buffer.from(
            profile.replace(/^data:image\/(png|jpg|jpeg|gif);base64./, ""),
            "base64"
        );
        
        
        const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;
        
        try {
            console.log("profile");
            const jimpResp = await jimp.read(buffer);
            jimpResp.write(__dirname + `../../storage/profile/${imagePath}`)

        } catch (error) {
            console.log("error in jimp");    
            return}

        let user;
        try {
            user = await userService.findUser({_id: userId});
            if(!user){
                res.status(404).json({message: "User not found"});
            }
            user.fname = fname;
            user.lname = lname;
            user.profile = `/storage/profile/${imagePath}`;
            user.secondaryEmail = secondaryEmail;
            user.address = {
                state: state,
                city: city
            }
            
            user.save();
            res.status(200).json({message: "Profile updated successfully"});


        } catch (error) {
            res.send("Update Failed");
        }
    }

    

    async changePassword(req,res){
        const {oldPassword, newPassword} = req.body;
        const userId = req.body.id;

        
        const user = await userService.findUser ({_id: userId});
        if(!user){
            res.status(404).json({message: "User not found"});
            return;
        }
        const isValid = await bcrypt.compare(oldPassword, user.password);
        const saltPassword = bcrypt.genSaltSync(10);
        const securePassword = await bcrypt.hash(newPassword, saltPassword);
        console.log(securePassword);

        if (isValid) {
        
            user.password = securePassword;
            user.save();
            res.status(200).json({message: "Password updated successfully"});
            return;
        }

         res.status(400).json({ message: "Old Password is invalid!" });
            return;
    }
}

module.exports = new UserController;