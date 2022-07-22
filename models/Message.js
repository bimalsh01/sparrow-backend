const mongooose = require('mongoose');

const MessageSchema = new mongooose.Schema(
    {
        conversationId:{
            type: String,
        },
        sender:{
            type: String,
        },
        text:{
            type: String,
        }
    },
    {timestamps:true}
);

module.exports = mongooose.model('Message', MessageSchema);

