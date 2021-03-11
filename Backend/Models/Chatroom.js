const mongoose = require("mongoose");

const chatroomSchema = new mongoose.Schema({
    name :{type:String,required:true},
    chatusers :{type:Array,required:false},

});

module.exports = mongoose.model("Chatroom", chatroomSchema);