import React from 'react'
import SignUp from '../component/SignUp'
import { CgLogIn } from 'react-icons/cg'
import Login from '../component/Login'
import { useRecoilValue } from 'recoil'
import { authScreenAtom } from '../atoms/Auth.atoms'

const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom)
  console.log(authScreenState);
  return (
    <>
      {authScreenState === 'login' ? <Login/> : <SignUp/>}
      
    </>
  )
}

export default AuthPage