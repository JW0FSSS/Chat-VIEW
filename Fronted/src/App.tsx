
import { Route, Routes } from "react-router";
import { User } from "./chat/user";



function App() {
  
  return(
    <Routes>
      <Route path='/user1' element={<User from={1} to={3}/>}/>
      <Route path='/user2' element={<User from={3} to={1}/>}/>
    </Routes>
    
  )

}

export default App
