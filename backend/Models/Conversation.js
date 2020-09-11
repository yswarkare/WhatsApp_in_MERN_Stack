const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const conversationSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: "user" },
    reveiver: { type: Schema.Types.ObjectId, ref: "user" },
    messages: [{
        message: { type: Schema.Types.ObjectId, ref: "message" },
        state: { type: String, enum: ["sent", "reveived"] },
        time: { type: Date, default: Date.now() }
    }]
},{
    timestamps: true
});

const Conversation = mongoose.model("conversation", conversationSchema);

module.exports = Conversation;