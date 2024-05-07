  import {
    Avatar,
    Box,
    Button,
    Divider,
    Flex,
    Image,
    Spinner,
    Text,
  } from "@chakra-ui/react";
  import React, { useEffect, useState } from "react";
  import Action from "../component/Action";
  import Comment from "../component/Comment";
  import useGetProfile from "../hooks/useGetProfile"
  import useShowToast from "../hooks/useShowToasts";
  import { useNavigate, useParams } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../atoms/userAtom";
import postsAtom from "../atoms/PostAtom";
import { v4 as uuidv4 } from 'uuid';

  const PostPage = () => {
    const {user, loading} = useGetProfile()
    const [posts, setPosts] = useRecoilState(postsAtom);
    const { pid } = useParams();
    const showToast = useShowToast()
    const currentUseer = useRecoilValue(userAtom)
    const navigate = useNavigate()
    const currentPost = posts[0]
    // console.log("currentPost0", uuidv4());
      useEffect(() => {
        const getPost = async () => {
          try {
          const res = await fetch(`/api/posts/${pid}`)
          const data = await res.json();
          if (data.error) {
            showToast("Error", data.error, "error")
            return;
          }
          console.log("i am postPage's post", data);
          setPosts([data])
          } catch (error) {
            showToast("error", error.message, "error")
            return;
          }
        }
        getPost();
      }, [showToast, pid, setPosts])

      const handleDeletePost = async() => {
        if(!window.confirm("Are you sure you wnat to delete this post?")) return;
        try {
          const res = await fetch(`/api/posts/${currentPost._id}`,{
            method:"DELETE"
          });
          const data = await res.json();
          if (data.error) {
            showToast("Error", data.error, "error")
            return;
          }
          showToast("Success", "Post Deleted Successfully", "success")
          navigate(`/${user.userName}`)
        } catch (error) {
          showToast("Error", error.message, "error")
          return;
        }
      };

    if(!user && loading) {
      return (
        <Flex justifyContent={"center"}>
          <Spinner size={"xl"}/>
        </Flex>
      )
    }
    if(!currentPost) return null;
    return (
      <>
        <Flex>
          <Flex w={"full"} alignItems={"center"} gap={3}>
            <Avatar src={user.userProfilePic} size={"md"} />
            <Flex>
              <Text fontSize={"small"} fontWeight={"bold"}>
                {user.fullName}
                
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={2} />
            </Flex>
          </Flex>
          <Flex gap={3} alignItems={"center"}>
            <Text fontSize={"small"} w={16} color={"gray.light"}>
            {formatDistanceToNow(new Date(currentPost.createdAt))} ago
            </Text>
            {
              user._id === currentUseer?._id && (
                <DeleteIcon onClick={handleDeletePost}  cursor={"pointer"} />
              )
            }
          </Flex>
        </Flex>

        <Text my={3}>{currentPost.text}</Text>
        {
          currentPost.img && (
            <Box
          border={"1px solid"}
          borderColor={"gray.light"}
          overflow={"hidden"}
          borderRadius={6}>
          <Image src={currentPost.img} w={"full"} />
        </Box>
          )
        }
        <Flex cursor={"pointer"} gap={3} my={3}>
          <Action post={currentPost}/>
        </Flex>
        
        <Divider my={4} />
        <Flex justifyContent={"space-between"}>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"2xl"} alignItems={"center"} gap={2}>
              👋
            </Text>
            <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
          </Flex>
          <Button>Get</Button>
        </Flex>
        <Divider my={4} />
        {
          currentPost.replies.map((reply) => (
            <Comment
              key={uuidv4()}
              reply={reply}
              lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1 ]._id}
          />
        ))
      }
    </>
  );
};

  export default PostPage;
