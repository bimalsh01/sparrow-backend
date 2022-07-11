const Users = require('../models/user-model');
const question = require('../models/question');

const userCtrl = {
    searchUser: async (req, res) => {
        try {
            const users = await Users.find({
                username: {$regex: req.body.username, $options: 'i'}
            })
            res.json({users})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    searchQsn: async (req, res) => {
        try {
            const data = await question.find({
                questionName: {$regex: req.body.questionName, $options: 'i'}
            }).populate('postedBy')
            res.status(201).json({data})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    
    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.params.id).select('-password')
            // .populate("followers following", "-password")
            if(!user) return res.status(400).json({msg: "User does not exist."})
            
            res.json({user})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}

module.exports = userCtrl