import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/message.modal.js";
import { getRecepientSocketId, io } from "../socket/socket.js";
import {v2 as cloudinary} from 'cloudinary'
export const SendMessage = async (req, res) => {
    
try {
    const {message, recepientId} = req.body;
    let {img} = req.body;
    const senderId = req.user._id;
    let conversation = await Conversation.findOne({
        participants:{$all : [senderId, recepientId]}
    })
    if (!conversation) {
        conversation = new Conversation({
            participants:[senderId, recepientId],
            lastMessage:{
                text:message,
                sender:senderId
            }
        })
        await conversation.save();
    }
    
    if(img) {
        const uplodedResponce = await cloudinary.uploader.upload(img)
        img = uplodedResponce.secure_url
    }

    const newMessage = new Message({
        conversationId:conversation._id,
        sender:senderId,
        text:message,
        img: img || ""
    })
    await Promise.all([
        newMessage.save(),
        conversation.updateOne({
            lastMessage:{
                text:message,
                sender:senderId
            }
        })
    ])

    const recepientSocketId = getRecepientSocketId(recepientId)

    if(recepientSocketId) {
    io.to(recepientSocketId).emit("newMessage",newMessage )
    }
    res.status(201).json(newMessage)
    
} catch (error) {

    res.status(500).json({error:error.message})
}
}

export const GetMessage = async (req, res) => {
    const {otherUserId} = req.params;
    const userId = req.user._id;
    try {
        const conversation = await Conversation.findOne({
            participants:{$all:[userId, otherUserId]}
        })
        if(!conversation) {
            return res.status(404).json({error:"Conversation not found"})
        }
        const messages = await Message.find({
            conversationId:conversation._id
        })  
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

export const GetConversation = async (req, res) => {
    const userId = req.user._id;
    try {
        const conversations = await Conversation.find({participants:userId}).populate({
            path:"participants",
            select:"userName userProfilePic"
        })
        conversations.forEach(conversation => {
            conversation.participants = conversation.participants.filter(participant => participant._id.toString() !== userId.toString())
        })
        if(!conversations) {
            return res.status(404).json({error:"Conversation not found"})
        }
        res.status(200).json(conversations)

    } catch (error) {
        res.status(500).json({error:error.message})
    }
}
