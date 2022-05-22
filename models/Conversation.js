const mongooose = require('mongoose');

const ConversationSchema = new mongooose.Schema(
    {
        members:{
            type: Array,
        },
    },
    {timestamps:true}
);

module.exports = mongooose.model('Conversation', ConversationSchema);