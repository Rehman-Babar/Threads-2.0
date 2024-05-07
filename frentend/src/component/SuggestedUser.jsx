import { Avatar, Box, Button, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'
import useFollowUser from '../hooks/useFollowUser'

const SuggestedUser = ({user}) => {
	const {following, handleFollowUnFollow, updating} = useFollowUser(user)
  return (
    <Flex gap={2} justifyContent={"space-between"} alignItems={"center"}>
			<Flex gap={2} as={Link} to={`/${user.userName}`} >
				<Avatar src={user.userProfilePic} />
				<Box>
					<Text fontSize={"sm"} fontWeight={"bold"}>
						{user.userName}
					</Text> 
					<Text color={"gray.light"} fontSize={"sm"}>
						{user.fullName}
					</Text>
				</Box>
			</Flex>
			<Button
				size={"sm"}	
				color={following ? "black" : "white"}
				bg={following ? "white" : "blue.400"}
				onClick={handleFollowUnFollow}
				isLoading={updating}
				_hover={{
					color: following ? "black" : "white",
					opacity: ".8",
				}}
			>
				{following ? "Unfollow" : "Follow"}
			</Button>
		</Flex> 
  )
}

export default SuggestedUser