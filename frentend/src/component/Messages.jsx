import { Avatar, Box, Flex, Text, Image, Skeleton } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { userAtom } from '../atoms/userAtom'
import { SelectedConversationAtom } from '../atoms/messageAtom'
import {BsCheck2All} from 'react-icons/bs'

const Messages = ({ownMessage, message}) => {
    const currentUser = useRecoilValue(userAtom)
    const selectedConversation = useRecoilValue(SelectedConversationAtom)
    const [loadedImg, setLoadedImg] = useState(false)
return (
    <>
    {ownMessage ? (
        <Flex gap={2} alignSelf={"self-end"}>
            {message.text && (
                <Flex background={"green.800"} maxW={"350px"} p={1} borderRadius={"md"}>
                <Text color={"white"}>{message.text}</Text>
                <Box alignSelf={"flex-end"} ml={1} color={message.seen ? "blue.400" : ""} fontWeight={"bold"}>
                    <BsCheck2All size={16} />
                </Box>
            </Flex>
            )}
            {message.img && !loadedImg && (
                <Flex mt={5} w={"200px"}>
                    <Image alt="Message Image" hidden onLoad={() => setLoadedImg(true)} src={message.img}
                    borderRadius={"md"}/>
                    <Skeleton w={"200px"} h={"200px"}/>
                </Flex>
            )}
            {message.img && loadedImg && (
                <Flex mt={5} w={"200px"}>
                    <Image alt="Message Image" src={message.img}
                    borderRadius={"md"}/>
                    <Box alignSelf={"flex-end"} ml={1} color={message.seen ? "blue.400" : ""} fontWeight={"bold"}>
                        <BsCheck2All size={16} />
                    </Box>
                </Flex>
            )}

            <Avatar src={currentUser.userProfilePic} w={7} h={7}/>
        </Flex>
    ) : (
        <Flex gap={2} alignSelf={"self-start"}>
            <Avatar src={selectedConversation.userProfilePic} w={7} h={7}/>
            {message.text && (
                <Text maxW={"350px"} bg={"gray.400"}
                color={"black"}
                borderRadius={4}
                p={2}
                >
                    {message.text}
                </Text>
            )}
            {message.img && !loadedImg &&  (
                <Flex mt={5} w={"200px"}>
                    <Image alt="Message Image" hidden onLoad={() => setLoadedImg(true)} src={message.img}
                    borderRadius={4}/>
                    <Skeleton w={"200px"} h={"200px"}/>
                </Flex>
            )}
            {message.img && loadedImg &&  (
                <Flex mt={5} w={"200px"}>
                    <Image alt="Message Image" src={message.img}
                    borderRadius={4}/>
                    
                </Flex>
            )}
        </Flex>
    )}
    </>
)
}

export default Messages