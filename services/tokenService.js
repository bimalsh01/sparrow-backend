const jwt = require("jsonwebtoken");
const refreshModal = require("../models/refresh-modal");

const accessTokenSecret = process.env.JWT_REFRESH_TOKEN;
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN;

class tokenService {
    generateToken(payload) {
        const accessToken = jwt.sign(payload, accessTokenSecret, { expiresIn: "1d" });
        const refreshToken = jwt.sign(payload, refreshTokenSecret, { expiresIn: "7d" });
        return { accessToken, refreshToken };
    }

    async findRefreshToken(userId, refreshToken) {
        console.log("Found!")
        return await refreshModal.findOne({ userId: userId, token: refreshToken });
    }

    async storeRefreshToken(token, userId) {
        try {
            await refreshModal.create({
                token,
                userId,
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    async verifyAccessToken(token) {
        return jwt.verify(token, accessTokenSecret);
    }
    
    async verifyRefreshToken(refreshToken) {
        return jwt.verify(refreshToken, refreshTokenSecret);
    }


    async updateRefreshToken(userId, refreshToken) {
        return await refreshModal.updateOne({ userId: userId , token: refreshToken })
    }

    async deleteToken(refreshToken) {
        return await refreshModal.deleteOne({ token: refreshToken });
    }


}

module.exports = new tokenService();