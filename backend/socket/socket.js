import {Server} from 'socket.io';
import express from 'express';
import http from 'http';
import {Message} from '../models/message.modal.js'
import { Conversation } from '../models/Conversation.js';

const app = express()
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET", "Post"]
    }
})

// For single user 

export const getRecepientSocketId = (recepientId) => {
    return userSocketMap[recepientId]
}
const userSocketMap = {}
// Connect
io.on("connection", (socket) => {
    console.log("User Connected", socket.id);

    // GetOnlineUsers
    const userId = socket.handshake.query.userId;
    if(userId !="undefined") userSocketMap[userId] = socket.id
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
    socket.on("markMessagesAsSeen", async({conversationId, userId}) => {
        try {
            await Message.updateMany({conversationId : conversationId, seen:false}, {$set :{seen:true}})
            await Conversation.updateOne({_id:conversationId}, {$set:{"lastMessage.seen":true}})
            io.to(userSocketMap[userId]).emit("messageSeen", {conversationId})
        } catch (error) {
            console.log("Errer in socket.js", error);
        }
    })
    // DisConnect
    socket.on("disconnect",() => {
    console.log("User DisConnected");
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
});


export { io, server, app }