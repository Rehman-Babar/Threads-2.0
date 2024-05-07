import React, { createContext, useEffect, useState } from 'react'
import UseHeader from '../component/UseHeader'
import UserPost from '../component/UserPost'
import { useParams } from 'react-router-dom';
import { Flex, Spinner, useToast } from '@chakra-ui/react';
// import UpdateProfilePage from './UpDateProfilePage';
// import { useRecoilState } from 'recoil';
// import UpdateProfilePage from './UpDateProfilePage';
import Post from '../component/Post'
import useGetProfile from '../hooks/useGetProfile';
import { useRecoilState } from 'recoil';
import postsAtom from '../atoms/PostAtom';

const UserPage = () => {
    const showToast = useToast()
    const {user, loading} = useGetProfile()
    const [ posts, setPosts ] = useRecoilState(postsAtom);
    const [ fetchingPost, setFetchingPost ] = useState(true);
    const {userName} = useParams();

    
    useEffect(() => {
      const getPost = async() => {
        if(!user) return;
        setFetchingPost(true)
      try {
        const res = await fetch(`api/posts/user/${userName}`)
        const data = await res.json();
        if (data.error) {
          showToast("Error", "Error in getting posts", "error")
        }
        setPosts(data)
      } catch (error) {
        showToast("Error",error.message, "error")
        } finally {
          setFetchingPost(false)
        }
      }
      getPost();
    }, [userName, showToast, setPosts, user])
    console.log("Posts is here ", posts);
    if (!user && loading) {
      return(
        <Flex justifyContent={'center'}>
          <Spinner size={'xl'}/>
        </Flex>
      )
    }
    if (!user && !loading) {
      return <Flex justifyContent={'center'}>
      <h1>User Not Found</h1>
    </Flex>;
    }
    
  return (
    <>
    <UseHeader user={user}/>
    {
      !fetchingPost && posts.length === 0 && <h1> {user.fullName} has not posts.</h1>
    }
    {
      fetchingPost && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"}/>
        </Flex>
      )
    }
    {
      posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy}/>
      ))
    }
    </> 
  )
}

export default UserPage;