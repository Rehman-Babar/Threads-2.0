    import mongoose from 'mongoose'

    const conversationSchema = new mongoose.Schema(
        {
        participants:[{type:mongoose.Types.ObjectId, ref:"User"}],
        lastMessage:{
            text:String,
            sender:{type:mongoose.Types.ObjectId, ref:"User"},
            seen:{
                type:Boolean,
                default:false
            }
        }   
    },
    {timestamps: true})

    export const Conversation = mongoose.model("Conversation", conversationSchema)
