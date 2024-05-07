import {atom} from 'recoil';

export const ConversationAtom = atom({
    key:"ConversationAtom",
    default:[]
})


export const SelectedConversationAtom = atom({
    key:"SelectedConversationAtom",
    default:{
        _id:"",
        userId:"",
        userName:"",
        userProfilePic:""
    }
})