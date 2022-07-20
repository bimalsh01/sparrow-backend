const Users = require('../models/user-model');
const question = require('../models/question');
const Conversation = require('../models/Conversation');

const userCtrl = {
    searchUser: async (req, res) => {
        try {
            const users = await Users.find({
                username: {$regex: req.body.username, $options: 'i'}
            })
            console.log(users, "users")
            res.status(201).json(users)
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
            
            res.status(201).json({
                "success":true,
                "data":[user]})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    getUserConversation: async (req, res) => {
        console.log(req.params.id, "req.params.id ------------------------------------------")
        try {
            const user = await Users.findById(req.params.id).select('-password')
            // .populate("followers following", "-password")

            // find in conversation
            // const conversation = await Conversation.find({
            //     members: { $in: [req.params.userId] },
            // });

            // print(conversation, "conversation")


            if(!user) return res.status(400).json({msg: "User does not exist."})
            
            res.status(201).json(user)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}

module.exports = userCtrl