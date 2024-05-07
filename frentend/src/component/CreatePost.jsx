import { AddIcon } from '@chakra-ui/icons'
import { Button, CloseButton, Flex, FormControl, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import usePreviewImg from '../hooks/userPrewieImg';
import { BsFillImageFill } from "react-icons/bs";
import { userAtom } from '../atoms/userAtom';
import { useRecoilState, useRecoilValue } from 'recoil';
import useShowToast from '../hooks/useShowToasts';
import postsAtom from '../atoms/PostAtom';
import { useParams } from 'react-router-dom';
const maxCHR = 500
const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {handleImageChange, imgUrl, setImgUrl} = usePreviewImg()
  const imageRef = useRef(null)
  const [postText, setPostText] = useState("");
  const [loading, setLoadig] = useState(false);
  const [remainingCharacter, setRemainingCharacter] = useState(maxCHR)
  const user = useRecoilValue(userAtom)
  const [posts, setPosts] = useRecoilState(postsAtom)
  const showToast = useShowToast()
  const {userName} = useParams()

  const handleTextChange = (e) =>{
    const inputText = e.target.value;
    if (inputText.length > maxCHR) {
      const truncatedText = inputText.slice(0, maxCHR)
      setPostText(truncatedText)
      setRemainingCharacter(0)
    } else{
      setPostText(inputText)
      setRemainingCharacter(maxCHR - inputText.length)
    }
  }
  
  const handleCreatePost =async () =>{
    setLoadig(true)
    try {
      const res = await fetch('/api/posts/create',{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({postedBy:user._id, text:postText, img:imgUrl})
      })
      const data = await res.json()
      if (data.error) {
        return showToast("Error", data.error, "error")
      }
      showToast("Success", "Post created successgully", "success")
      if (userName === user.userName) {
        setPosts([data, ...posts])
      }
      onClose()
      setPostText("")
      setImgUrl("")
    } catch (error) {
      showToast("Error", error, "error")
      
    } finally{
      setLoadig(false)
    }
  }
  
  return (
    <>
    <Button onClick={onOpen}
    position={'fixed'}
    bottom={10}
    right={5}
    size={{base:"sm", sm:"md"}}
    bg={useColorModeValue("gray.300", "gray.dark")}>
        <AddIcon/>
    </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
              placeholder='Post content goes here..'
              value={postText}
              onChange={handleTextChange}
              />
              <Text fontSize={'small'} fontWeight={'bold'} textAlign={'right'} color={'gray.800'}>
                {remainingCharacter}/{maxCHR}
              </Text>
              <Input
              ref={imageRef}
              type='file'
              hidden
              onChange={handleImageChange}
              />
              <BsFillImageFill
              style={{marginLeft:"5px", cursor:"pointer"}}
              size={16}
              onClick={()=> imageRef.current.click() }
              />
            </FormControl>
            {
              imgUrl &&(
                <Flex mt={5} w={'full'} position={'relative'}>
                  <Image src={imgUrl} alt='selected img'/>
                  <CloseButton
                  onClick={()=> setImgUrl("")}
                  position={'absolute'}
                  right={2}
                  top={2}
                  />
                </Flex>
              )
            }
          </ModalBody>
          <ModalFooter>
            
            <Button type='submit' onClick={handleCreatePost} isLoading={loading}>Post</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreatePost