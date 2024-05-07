import { Avatar, Divider, Flex, Image, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import Messages from './Messages'
import MessageInput from './MessageInput'
import useShowToast from '../hooks/useShowToasts'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { ConversationAtom, SelectedConversationAtom } from '../atoms/messageAtom'
import { userAtom } from '../atoms/userAtom'
import { useSocket } from '../context/SocketContext'
import { v4 as uuidv4 } from 'uuid';
import messageSound from '../asets/sounds/message.mp3';
const MessageContainer = () => {
    const selectedConversation = useRecoilValue(SelectedConversationAtom);
    const [loadingMessages, setloadingMessages] = useState(true)
    const [messages, setMessages] = useState([])
    const showToast = useShowToast()
    const currentUser = useRecoilValue(userAtom)
    const {socket} = useSocket()
    const setConversation = useSetRecoilState(ConversationAtom)
    const messageEndRef = useRef(null);
    useEffect(() => {
        socket.on("newMessage", (message) => {
            if (selectedConversation._id === message.conversationId) {
				setMessages((prev) => [...prev, message]);
			}
            if(!document.hasFocus()) {
                const sound = new Audio(messageSound)
                sound.play()
            }

            setConversation((prev) => {
                const updatedConversations = prev.map((conversation) => {
                    if (conversation._id === message.conversationId) {
                        return {
                            ...conversation,
                            lastMessage:{
                                text:message.text,
                                sender:message.sender
                            }
                        }
                    }
                    return conversation
                })
                return updatedConversations
            })
            return () =>  socket.off("newMessage")
        })
        
    }, [socket, selectedConversation, setConversation])

    useEffect(() => {
        const lastMessageIsFromOtherUser =messages.length && messages[messages.length -1].sender !== currentUser._id
        if(lastMessageIsFromOtherUser){
            socket.emit("markMessagesAsSeen",{
                conversationId:selectedConversation._id,
                userId:selectedConversation.userId
            })
        }
        socket.on("messageSeen",({conversationId}) => {
            if(selectedConversation._id === conversationId) {
                setMessages((prev) => {
                    const updatedMessages = prev.map((message) => {
                        if(!message.seen) {
                            return {
                                ...message, 
                                seen:true
                            }
                        }
                        return message;
                    })
                    return updatedMessages; 
                })
            }
        })
    }, [socket, currentUser._id, messages, selectedConversation])

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])



    useEffect(() => {
        const getMessages = async () => {
            setloadingMessages(true)
            // selectedConversation
            try {
                if (selectedConversation.mock) return;
                const res = await fetch(`/api/messages/${selectedConversation.userId}`)
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error")
                    return;
                }
                setMessages(data)
            } catch (error) {
                showToast("Error", error.message, "error")
                return;
            } finally {
                setloadingMessages(false)
            }
        }            
        getMessages();
    }, [showToast, selectedConversation.userId, selectedConversation.mock])
return (
    <Flex
    flex={70}
    flexDir={"column"}
    bg={useColorModeValue("gray.200","gray.dark")}
    borderRadius={"md"}
    >
        {/*MESSAGE HEADER */}
            <Flex p={2} w={"full"} h={12} alignItems={"center"} gap={2}>
                <Avatar src={selectedConversation.userProfilePic} size={"sm"}/>
                <Text display={"flex"} fontSize={"sm"}>
                    {selectedConversation.userName}<Image src='/verified.png' w={4} h={4} ml={1} alignItems={"center"}/>
                </Text>
            </Flex>
            <Divider/>
            {/* MESSAGES */}
            <Flex flexDir={"column"}
            my={4}
            p={2}
            gap={4}
            height={"400px"}
            overflowY={"auto"}

            >
                {/* SKELTANS */}
                {loadingMessages &&
					[...Array(5)].map((_, i) => (
						<Flex
							key={i}
							gap={2}
							alignItems={"center"}
							p={1}
							borderRadius={"md"}
							alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
						>
							{i % 2 === 0 && <SkeletonCircle size={7} />}
							<Flex flexDir={"column"} gap={2}>
								<Skeleton h='8px' w='250px' />
								<Skeleton h='8px' w='250px' />
								<Skeleton h='8px' w='250px' />
							</Flex>
							{i % 2 !== 0 && <SkeletonCircle size={7} />}
						</Flex>
					))}
            {!loadingMessages &&
					messages.map((message) => (
						<Flex
							key={message._id}
							direction={"column"}
                            ref={messages.length -1 === messages.indexOf(message)? messageEndRef : null}
							// ref={messages.length - 1 === messages.indexOf(message) ? messageEndRef : null}
						>
							<Messages message={message} ownMessage={currentUser._id === message.sender} />
						</Flex>
					))}
            
            </Flex>
            <MessageInput setMessages={setMessages}/>
    </Flex>
)
}

export default MessageContainer