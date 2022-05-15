class userDto{
    id;
    phone;
    activated;
    createdAt;
    fname;
    lname;
    username;
    password;
    profile;
    followers;
    following;
    secondaryEmail;
    address;

    constructor(user){
        this.id = user._id;
        this.phone = user.phone;
        this.name = user.name;
        this.profile = user.profile;
        this.activated = user.activated;
        this.createdAt = user.createdAt;
        this.fname = user.fname;
        this.lname = user.lname;
        this.username = user.username;
        this.password = user.password;
        this.followers = user.followers;
        this.following = user.following;
        this.secondaryEmail = user.secondaryEmail;
        this.address = user.address;
    }
}

module.exports = userDto;;