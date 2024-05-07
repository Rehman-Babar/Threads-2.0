import { Box, Button, Container } from "@chakra-ui/react";
import { Route,Navigate, Routes, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./component/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
// import userAtom, { useAuthContext } from "./atoms/UserAtom.jsx";
// import LogoutButton from "./component/LogoutButton.jsx";
// import UserProfileEdit from "./pages/UpDateProfilePage.jsx";
// import UpdateProfilePage from './pages/UpDateProfilePage.jsx'
import UpdateProfilePage from "./pages/UpDateProfilePage.jsx";
import {userAtom} from "./atoms/userAtom.js";
import CreatePost from "./component/CreatePost.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import SettingPage from "./pages/SettingPage.jsx";

function App() {
  const user = useRecoilValue(userAtom);
  const {pathname} = useLocation()
  return (
    <Box position={"relative"} w={"full"}>
    <Container maxW={pathname === "/" ? {base:"620px", md:"900px"} : "620px"}>
      <Header />
      <Routes>
        <Route path="/" element={user ? <HomePage/> : <Navigate to='/auth' />}/>
        <Route path="/auth" element={!user ? <AuthPage/> : <Navigate to='/'/>}/>
        <Route path="/update" element={user ? <UpdateProfilePage/> : <Navigate to='/auth'/>}/>

        <Route path="/:userName" element={
          
          user ? (
            <>         
            <UserPage />
            <CreatePost/>
            </>
          ) : (
            <UserPage/>
          ) 
        } />
        
        <Route path="/:userName/post/:pid" element={<PostPage />} />
        <Route path="/chat" element={user ? <ChatPage /> : <Navigate to={'/auth'}/>} />
        <Route path="/setting" element={user ? <SettingPage /> : <Navigate to={'/auth'}/>} />
      </Routes>
    </Container>
    </Box>
  );
}

export default App;
