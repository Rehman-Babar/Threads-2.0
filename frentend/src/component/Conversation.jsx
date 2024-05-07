import { Avatar, AvatarBadge, Box, Flex, Image, Stack, Text, WrapItem, useColorMode, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import {userAtom} from '../atoms/userAtom.js'
import {BsCheck2All, BsFillImageFill} from 'react-icons/bs'
import { SelectedConversationAtom } from '../atoms/messageAtom.js';
const Conversation = ({conversation, isOnline}) => {
  const user = conversation.participants[0];
  const lastMessage = conversation.lastMessage
  const currentUser = useRecoilValue(userAtom)
  const [selectedConversation, setSelectedConversation] = useRecoilState(SelectedConversationAtom)
  const colorMode = useColorMode();
  
  return (
    <Flex 
    gap={4}
    p={1}
    alignItems={"center"}
    borderRadius={"md"}
    onClick={() => setSelectedConversation({
      _id:conversation._id,
      userId:user._id,
      userName:user.userName,
      userProfilePic:user.userProfilePic,
      mock:conversation.mock,
    })}
    bg={
      selectedConversation?._id === conversation._id ? (colorMode === "dark" ? "gray.400" : "gray.400")
      : ""
    }
    >
    <WrapItem>
        <Avatar src={user.userProfilePic}
        size={{base:"xs", sm:"sm", md:"md"}}
        >
          {isOnline ? <AvatarBadge boxSize={"1em"} bg={"green"}/> : ""}
        </Avatar>
    </WrapItem>
    <Stack flexDirection={"column"} fontSize={"sm"}>
      <Text fontWeight={"700"} display={"flex"} alignItems={"center"}>
        {user.userName} <Image src='/verified.png' w={4} h={4} ml={1}/>
      </Text>
      <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
        {currentUser._id === lastMessage.sender ? (
          <Box color={lastMessage.seen ? "blue.400" : ""}>
            <BsCheck2All size={"16"}/>
          </Box>
        ) : ""}
        {lastMessage.text.length > 18 ? lastMessage.text.slice(0, 18) + "..." : lastMessage.text || <BsFillImageFill size={16} /> }
        </Text>
    </Stack>
    </Flex>
  )
}

export default Conversation