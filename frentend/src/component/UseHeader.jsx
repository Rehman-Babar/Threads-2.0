import { Avatar, Box, Button, Flex, Link, Menu, MenuButton, MenuItem, MenuList, Portal, Text, VStack, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import {BsInstagram} from 'react-icons/bs'
import {CgMoreO} from 'react-icons/cg'
import {useRecoilValue} from 'recoil'
import {userAtom} from '../atoms/userAtom'
import {Link as RouterLink} from 'react-router-dom'
import useShowToast from '../hooks/useShowToasts'
import useFollowUser from '../hooks/useFollowUser.js'

const UseHeader = ({user}) => {
    const showToast = useShowToast();
    const currentUser = useRecoilValue(userAtom)
    // const [following, setFollowing] = useState(user.followers.includes(currentUser ?._id))
    // const [updating, setUpdateing] = useState(false)
    const {following, handleFollowUnFollow, updating} = useFollowUser(user)
    

    const CopyLink = ()=>{
        
        const currentURL = window.location.href;
        navigator.clipboard.writeText(currentURL).then(()=>{
            toast({
                title:"Link Copied",
                status: "success",
                duration:'3000'
            })
        })
    }
    return (
        <>
        
    <VStack gap={4} alignItems={"start"}>
        <Flex justifyContent={'space-between'} w={'full'}>
            <Box>
                <Text fontSize={'2xl'} fontWeight={'bold'}>{user.fullName}</Text>
                <Flex gap={2} alignItems={'center'}>
                    <Text fontSize={'sm'}>{user.userName}</Text>
                    <Text bg={"gray.dark"} color={"gray.light"} fontSize={'xs'} p={1} borderRadius={'full'}>threads.net</Text>
                </Flex>
            </Box>
            <Box>
                {user.userProfilePic && (
                    <Avatar name={user.fullName} size={{
                        base:'md',
                        md:'xl'
                    }} src={user.userProfilePic}/>
                )}
                {!user.userProfilePic && (
                    <Avatar name='Mark Zuckerburg' size={{
                        base:'md',
                        md:'xl'
                    }} src={'https://bit.ly/broken-link'}/>
                )}
            </Box>
        </Flex>

        <Text>{user.bio}</Text>
            { currentUser?._id === user._id &&(
                <Link as={RouterLink} to={'/update'}>
                <Button size={'sm'}>Update Profile</Button>
                </Link>)}
            { currentUser?._id !== user._id &&
            ( <Button size={'sm'} onClick={handleFollowUnFollow} isLoading={updating}>
                {following ? "Unfollow": "Follow"}
            </Button>)}
            

        <Flex w={'full'} justifyContent={'space-between'}>
            <Flex gap={2} alignItems={'center'}>
                <Text color={'gray.light'}>{user.followers.length} followers</Text>
                <Box h={1} w={1} bg={'gray.light'} borderRadius={'full'}></Box>
                <Link color={'gray.light'}>instagram.com</Link>
            </Flex>
            <Flex >
                <Box className='icon-container'>
                    <BsInstagram  size={24} cursor={'pointer'}/>
                </Box>
                <Box className='icon-container'>
                    <Menu>
                        <MenuButton>
                        <CgMoreO  size={24} cursor={'pointer'}/>
                        </MenuButton>
                        <Portal>
                            <MenuList bg={'gray.dark'}>
                                <MenuItem onClick={CopyLink} bg={'gray.dark'}>Copy link</MenuItem>
                            </MenuList>
                        </Portal>
                    </Menu>
                </Box>
            </Flex>
        </Flex>
        <Flex w={'full'}>
            <Flex flex={1} justifyContent={'center'} cursor={'pointer'} borderBottom={'1.5px solid white'} pb={3}>
                <Text fontWeight={'bold'}>Threads</Text>
            </Flex>
            <Flex flex={1} justifyContent={'center'} color={'gray.light'}  cursor={'pointer'} borderBottom={'1.5px solid gray'} pb={3}>
                <Text fontWeight={'bold'}>Replys</Text>
            </Flex>
            
        </Flex>
    </VStack>
    </>
  )
}

export default UseHeader