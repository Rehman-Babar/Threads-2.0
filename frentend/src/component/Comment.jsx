import { Avatar, Center, Divider, Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import Action from "./Action";
import { color } from "framer-motion";

const Comment = ({ reply, lastReply }) => {
  
  return (
    <>
      <Flex gap={3} my={4} w={"full"}>
        <Avatar size={"sm"} src={reply.userProfilePic} />
        <Flex w={"full"} flexDirection={"column"} gap={2}>
          <Flex gap={3} justifyContent={"space-between"} alignItems={"center"}>
            <Flex>
              <Text fontSize={"sm"} fontWeight={"bold"}>
                {reply.userName}
              </Text>
            </Flex>   
          </Flex>
          <Text>{reply.text}</Text>
        </Flex>
      </Flex>
      {!lastReply ? <Divider my={4} /> : null}
      
    </>
  );
};

export default Comment;
