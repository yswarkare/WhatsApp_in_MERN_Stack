const express = require("express");
const router = express.Router();

const Message = require("../Models/Message");
const User = require("../Models/User");
const Conversation = require("../Models/Conversation");

router.get("/unread", async (req, res) => {
    try {
        let messages_01 = await Message.find({
            receiver: req.body.user_id,
            read: false
        });
        return res.status(200).json({ status: true, message: "got unread messages", messages: messages_01 });
    } catch (err) {
        return res.status(401).json({ status: false, message: `failed to get unread messages \n ${err}`, error: {err} });
    }
});

router.get("/sent", async (req, res) => {
    try {
        let messages_01 = await Message.find({
            sender: req.body.user_id,
            receiver: req.body.frined_id
        });
        return res.status(200).json({ status: true, message: "got sent messages", messages: messages_01});
    } catch (err) {
        return res.status(401).json({ status: false, message: `failed to get sent messages \n ${err}`, error: {err} })
    }
});

router.post("/send", async (req, res) => {
    try {
        let newMessage = new Message({
            text: req.body.text,
            sender: req.body.user_id,
            receiver: req.body.frined_id
        });
        // save for user
        let message_01 = newMessage.save();
        let conversation_01 = await Conversation.find({
            sender: req.body.user_id,
            receiver: req.body.frined_id,
        });
        let messages_01;
        if (conversation_01.messages) {
            messages_01 = conversation_01.messages;
        } else {
            messages_01 = []
        }
        messages_01.push({
            message: message_01._id,
            status: "sent",
            time: Date.now()
        });
        // save for reveiver
        let conversation_02 = await Conversation.find({
            sender: req.body.frined_id,
            receiver: req.body.user_id
        });
        let messages_02;
        if (conversation_02.messages) {
            messages_02 = conversation_02.messages;
        } else {
            messages_02 = []
        }
        messages_02.push({
            message: message_01._id,
            status: "received",
            time: Date.now()
        });
        return res.status(200).json({ status: true, message: "got conversation messages", message: message_01})
    } catch (err) {
        return res.status(401).json({ status: false, message: `failed to get conversation messages \n ${err}`, error: {err} })
    }
});

module.exports = router;