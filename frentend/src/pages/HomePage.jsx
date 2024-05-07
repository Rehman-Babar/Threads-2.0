import {Flex, Button, useColorModeValue, Spinner, Box} from '@chakra-ui/react'
import { useEffect } from 'react'
import {Link} from 'react-router-dom'
import useShowToast from '../hooks/useShowToasts.js'
import { useState } from 'react'
import Post from '../component/Post.jsx'
import { useRecoilState } from 'recoil'
import postsAtom from '../atoms/PostAtom.js'
import SuggestedUsers from '../component/SuggestedUsers.jsx'
const HomePage = () => {
  const [ posts, setPosts ] = useRecoilState(postsAtom)
  const [ loading, setLoading ] = useState(true)
  const showToast = useShowToast()
  useEffect(() => {
    const getFeeds =async(e) => {
      setLoading(true)
      try {
        setPosts([])
        const res =await fetch('/api/posts/feed')
        const data = await res.json()
        if (data.error) {
          showToast("Error", data.error, "error")
          return;
        }
        setPosts(data)
      } catch (error) {
        showToast("Error", error.message, "error")
      } finally {
        setLoading(false)
      }
    }
    getFeeds()
  }, [showToast,setPosts])
  return (
  <Flex gap={10} alignItems={"flex-start"}>
    <Box flex={70}>
    {!loading && posts.length === 0 && <h1>Follow some users to see the feed.</h1>}
  {loading && (
      <Flex justifyContent={'center'}>
        <Spinner size= "xl"/>
      </Flex>
    )}
    {
      posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy}/>
      ))
    }
    </Box>
    <Box flex={30}
    display={{
      base:"none",
      md:"block"
    }}
    >
      <SuggestedUsers/>
    </Box>
  </Flex>
  )
}

export default HomePage