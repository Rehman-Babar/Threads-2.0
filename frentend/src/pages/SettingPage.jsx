import { Button, Text } from '@chakra-ui/react'
import React from 'react'
import useShowToast from '../hooks/useShowToasts';
import useLogout from '../hooks/useLogout';

const SettingPage = () => {
    const showToast = useShowToast();
    const logout  = useLogout()
    const handleFreez = async() => {
        if(!window.confirm("Are you sure you want to delete your account.")) return;
        try {
            const res = await fetch(`/api/users/freez`,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                }
            })
            const data =await res.json();
            if(data.error) {
                showToast("Error", data.error, "error")
                return;
            }
            console.log(data);
            await logout();
            showToast("Success","Your account has been frozen", "success")
        } catch (error) {
            showToast("Error",error.message, "error")
            
        }
    }
  return (
    <>
    <Text my={1} fontWeight={"bold"}>Freez Your Account</Text>
    <Text my={1}>You can unfreez your account any time by loggingin.</Text>
    <Button colorScheme='red' onClick={handleFreez}>Freez</Button>
    </>
  )
}

export default SettingPage