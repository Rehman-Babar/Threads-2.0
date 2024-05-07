import { Avatar, Box, Flex, Image, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom'
import Action from './Action'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import useShowToast from '../hooks/useShowToasts'
import {DeleteIcon} from '@chakra-ui/icons'
import { useRecoilState, useRecoilValue } from 'recoil'
import { userAtom } from '../atoms/userAtom'
import postsAtom from '../atoms/PostAtom'


const Post = ({post, postedBy, }) => {
  const [user, setUser] = useState(null)
  const showToast = useShowToast()
  const navigate = useNavigate()
  const currentUseer = useRecoilValue(userAtom)
  const [posts, setPosts] = useRecoilState(postsAtom)
  
  useEffect(() => {
    const getProfile = async() => {
      try {
        const res = await fetch(`/api/users/profile/${postedBy}`)
        const data = await res.json()
        if (data.error) {
          showToast("Error", data.error, "error")
          return;
        }
        setUser(data)
      } catch (error) {
        showToast("Error", error.message, "error")
        setUser(null)
        return;
      }
    }
    getProfile();
  }, [postedBy, showToast])

  const handleDeletePost = async(e) => {
    e.preventDefault();
    if(!window.confirm("Are you sure you wnat to delete this post")) return;
    try {
      const res = await fetch(`/api/posts/${post._id}`,{
        method:"DELETE"
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error")
        return;
      }
      showToast("Success", "Post Deleted Successfully", "success")
      setPosts(posts.filter((p) => p._id !== post._id))
    } catch (error) {
      showToast("Error", error.message, "error")
      return;
    }
  };
  
  if(!user) return null;
  
  return (
    <Link to={`/${user.userName}/post/${post._id}`}>
      <Flex gap={3} py={5} mb={4}>

        <Flex flexDirection={'column'}
        onClick={(e) => {
          e.preventDefault();
          navigate(`/${user.userName}`)
        }}
        >
          <Avatar size={'md'} name={user.FullName} src={user.userProfilePic}
          
          />
          <Box w={1} h={'full'} my='4' ml={6} mb={10} bg={'gray.light'} borderRadius={3} ></Box>
          <Box position={'relative'} w={'full'}>
          {post.replies.length === 0 && <Text alignItems={'center'}>🥱</Text>}
          {
            post.replies[0] && (
              <Avatar
            size={'xs'}
            name='john doe'
            src={post.replies[0].userProfilePic}
            position={'absolute'}
            top={'0px'}
            left={'15px'}
            padding={'2px'}
            />
            )
          }
          
          {post.replies[1] && (
            <Avatar
            size={'xs'}
            name='john doe'
            src={post.replies[1].userProfilePic}
            position={'absolute'}
            bottom={'0px'}
            right={'-5px'}
            padding={'2px'}
            />
          )}
            {post.replies[2] && (
              <Avatar
              size={'xs'}
              name='john doe'
              src={post.replies[2].userProfilePic}
              position={'absolute'}
              bottom={'0px'}
              left={'4px'}
              padding={'2px'}
              />
            )}
            
          </Box>
        </Flex>

        <Flex flex={1} flexDirection={'column'} gap={2}>
          <Flex justifyContent={'space-between'} w={'full'}>
            <Flex w={'full'} alignItems={'center'}>
              <Text fontSize={'small'} fontWeight={'bold'}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${user.userName}`)
              }}
              >{user.userName}</Text>
              <Image src='/verified.png' width={4} h={4} ml={1}/>
            </Flex>
            
            <Flex alignItems={'center'} gap={3}>
              <Text color={'gray.light'} fontSize={'xs'} width={36} textAlign={'right'}>
              {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>
              {
                currentUseer?._id === user._id && (
                  <DeleteIcon size={20} onClick={handleDeletePost}/>
                )
              }
            </Flex>
          </Flex>
          <Text>{post.text}</Text>
            {
              post.img &&(
                <Box border={'1px solid'} borderColor={'gray.light'} overflow={'hidden'} borderRadius={6}>
              <Image src={post.img} w={'full'}/>
            </Box>
              )
            }
            <Flex gap='2' my={1}>
              <Action post={post} />
            </Flex>
        </Flex>

      </Flex>
    </Link>
  )
}

export default Post