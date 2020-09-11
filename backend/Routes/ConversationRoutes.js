const express = require("express");
const router = express.Router();

const Conversation = require("../Models/Conversation");
const { userAuth } = require("../Utils/Auth");

router.get("/get", userAuth, async (req, res) => {
    try {
        let conversation_01 = await Conversation.find({
            sender: req.body.user_id,
            reveiver: req.body.friend_id
        });
        return res.status(200).json({ status: true, message: "got conversation successfully", conversation: conversation_01});
    } catch (err) {
        return res.status(401).json({ status: false, message: `failed to get conversation \n ${err}`, error: {err} });
    }
});

router.post("/start", async (req, res) => {
    try {
        let newConversation_01 = new Conversation({
            sender: req.body.user_id,
            receiver: req.body.frined_id,
        });
        let conversation_01 = newConversation_01.save();

        let newConversation_02 = new Conversation({
            sender: req.body.frined_id,
            receiver: req.body.user_id
        });
        let conversation_02 = newConversation_02.save();
        return res.status(200).json({ status: true, message: "conversations successfully created", conversations: { ...conversation_01, ...conversation_02} });
    } catch (err) {
        return res.status(401).json({ status: false, message: `\n ${err}`, error: {err} });
    }
});

module.exports = router;