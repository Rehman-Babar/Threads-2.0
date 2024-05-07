import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useShowToast from './useShowToasts'

const useGetProfile = () => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const {userName} = useParams();
    const showToast = useShowToast()
    useEffect(() => {
        const getUser = async() =>{
                try {
                const res = await fetch(`/api/users/profile/${userName}`)
                const data = await res.json();
                
                if (data.error) {
                    showToast({
                    title:"Error",
                    description:data.error,
                    status:"error",
                    isClosable:true,
                    duration:3000
                    })
                    return;
                }
                if(data.isFroozen) {
                    setUser(null)
                    return;
                }
                setUser(data)
                } catch (error) {
                showToast({
                    title:"Error",
                    description:error,
                    status:"error",
                    isClosable:true,
                    duration:3000
                })
                } finally {
                setLoading(false)
            }
        }
        getUser();
    }, [userName, showToast])
    return {user, loading}
    
    
}

export default useGetProfile