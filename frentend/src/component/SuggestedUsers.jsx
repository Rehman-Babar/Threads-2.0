import { Box, Flex, Skeleton, SkeletonCircle, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import SuggestedUser from './SuggestedUser.jsx'
import useShowToast from '../hooks/useShowToasts.js'
const SuggestedUsers = () => {
    const [ loading, setLoading ] = useState(false)
    const [ SuggestedUsers, setSuggestedUsers ] = useState([])
    const showToast = useShowToast();

    useEffect(() => {

        const getSuggestedUsers = async () => {
            setLoading(true)
            try {
                const res = await fetch(`/api/users/suggested`)
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error")
                }
                setSuggestedUsers(data)
            } catch (error) {
                showToast("Error", error.message, "error")
            } finally {
                setLoading(false)
            }
        }
        getSuggestedUsers();
        
    }, [showToast])

  return (
    <>
    <Text mb={4} fontWeight={"bold"}>
    Suggested User
    </Text>
    <Flex  flexDir={"column"} gap={4}>
        {!loading && SuggestedUsers.map((user) => <SuggestedUser key={user._id} user={user}/>)}
        {loading && [0, 1, 2, 3, 4].map((_, idx) => (
            <Flex key={idx} alignItems={"center"} p={1} borderRadius={"md"} gap={2}>
                {/* Avatar Skelton */}

                <Box>
                    <SkeletonCircle size={10}/>
                </Box>

                <Flex w={"full"} flexDir={"column"} gap={2}>
                    <Skeleton h={"8px"} w={"80px"}/>
                    <Skeleton h={"8px"} w={"90px"}/>
                </Flex>

                <Flex>
                    <Skeleton h={"20px"} w={"60px"}/>
                </Flex>

            </Flex>
        ))}
    </Flex>
    </>
  )
}

export default SuggestedUsers