
import React, { useState } from 'react'
import toast from 'react-hot-toast'
// import { useAuthContext } from '../../context/authContext'
import { useSetRecoilState } from 'recoil'

function useUpdate() {
    const user = JSON.parse(localStorage.getItem("user-threads"))
    // console.log('uuuuuuuuuuuuu', user);
const [loading, setLoading] = useState(false)
// const setUser = useSetRecoilState()
const Update = async ({inputs}) => {
    try {
        // console.log(formData);
        console.log('iiiiiiiiiiiiiiiiiiiiiid', inputs);
        setLoading(true);
        const res = await fetch(`/api/users/update${user._id}`, {
            method: "PUT",
            body: JSON.stringify(inputs)
        });

        

        const data = await res.json(); // Await the json() method

        if (data.error) {
            toast({
                title: "error",
                description: data.error,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } else{
                toast({
                    title: "Success",
                    description: "Profile updated successfully.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                localStorage.setItem("user-threads", JSON.stringify(data));
                setUser(data);
            }

        
    } catch (error) {
        toast.error(error.message);
    } finally {
        setLoading(false);
    }
};
return {loading, Update}

}

export default useUpdate
