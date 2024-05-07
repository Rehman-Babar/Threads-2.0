import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import useShowToast from './useShowToasts';
import { userAtom } from '../atoms/userAtom';

const useFollowUser = (user) => {
    const currentUser = useRecoilValue(userAtom)
    const showToast = useShowToast();
    const [updating, setUpdateing] = useState(false)
    const [following, setFollowing] = useState(user.followers.includes(currentUser ?._id))

    const handleFollowUnFollow = async() => {
        if (!currentUser) {
            showToast("Error", "Please login  first to follow a user")
            return;
        }
        if(updating) return
        setUpdateing(true)
            try {
                const res = await fetch(`/api/users/follow/${user._id}`,{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    }
                })
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error")
                    return;
                }
                if (following) {
                    showToast("Success", `Unfollowed ${user.fullName}`, "success")
                    user.followers.pop()
                } else{
                    showToast("Success", `Followed ${user.fullName}`, "success")
                    user.followers.push(currentUser?._id)
                }
                console.log(data);
                setFollowing(!following)
            } catch (error) {
                showToast("Error", error, "error")
                return;
            } finally{
                setUpdateing(false)
            }
        
        
    }
    return {following, updating, handleFollowUnFollow}
}


export default useFollowUser