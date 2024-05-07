import { Avatar, Box, Flex, Image, Text } from '@chakra-ui/react'
import React from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import Action from './Action'
import { useState } from 'react'



const UserPost = ({likes, replies, postImage, postTitle}) => {
  const [liked, setLiked] = useState(false)
  return (
    <Link to={'/username/post/:123'}>
      <Flex gap={3} py={5} mb={4}>

        <Flex flexDirection={'column'}>
          <Avatar size={'md'} name='zuckerburgbarg' src='/zuck-avatar.png'></Avatar>
          <Box w={1} h={'full'} my='4' ml={6} mb={10} bg={'gray.light'} borderRadius={3} ></Box>
          <Box position={'relative'} w={'full'}>
            <Avatar
            size={'xs'}
            name='john doe'
            src='https://bit.ly/dan-abramov'
            position={'absolute'}
            top={'0px'}
            left={'15px'}
            padding={'2px'}
            />
            <Avatar
            size={'xs'}
            name='john doe'
            src='https://bit.ly/prosper-baba'
            position={'absolute'}
            bottom={'0px'}
            right={'-5px'}  
            padding={'2px'}
            />
            <Avatar
            size={'xs'}
            name='john doe'
            src='https://bit.ly/code-beast'
            position={'absolute'}
            bottom={'0px'}
            left={'4px'}
            padding={'2px'}
            />
          </Box>
        </Flex>

        <Flex flex={1} flexDirection={'column'} gap={2}>
          <Flex justifyContent={'space-between'} w={'full'}>
            <Flex w={'full'} alignItems={'center'}>
              <Text fontSize={'small'} fontWeight={'bold'}>markzuckerburg</Text>
              <Image src='/verified.png' width={4} h={4} ml={1}/>
            </Flex>
            
            <Flex alignItems={'center'} gap={3}>
              <Text color={'gray.light'} fontSize={'sm'}>1d</Text>
              <BsThreeDots/>
            </Flex>
          </Flex>
          <Text>{postTitle}</Text>
            {
              postImage &&(
                <Box border={'1px solid'} borderColor={'gray.light'} overflow={'hidden'} borderRadius={6}>
              <Image src={postImage} w={'full'}/>
            </Box>
              )
            }
            <Flex gap='2' my={1}>
              <Action liked={liked} setLiked={setLiked}/>
            </Flex>
            <Flex gap={3} alignItems={'center'}>
              <Text fontSize={'sm'} color={'gray.light'}>{replies} replies</Text>
              <Box w={0.5} h={0.5} bg={'gray.light'}></Box>
              <Text fontSize={'sm'} color={'gray.light'}>{likes} likes</Text>

            </Flex>
        </Flex>

      </Flex>
    </Link>
  )
}

export default UserPost