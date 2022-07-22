const mongoose = require('mongoose');

const FavouriteSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        questionId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Questions'
        }
    },
   
);

module.exports = mongoose.model('Favourite', FavouriteSchema);



