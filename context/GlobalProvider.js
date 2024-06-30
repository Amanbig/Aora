import { createContext,useState,useContext,useEffect } from "react";
import { getCurrentUser } from "../lib/appwrite";

const GlobalContext = createContext();

export const useGlobalContext = ()=>useContext(GlobalContext);

export const GlobalProvider = ({children})=>{
    const [isLoggedIn, setisLoggedIn] = useState(false)
    const [User, setUser] = useState(null)
    const [isLoading, setisLoading] = useState(true)

    useEffect(() => {
      getCurrentUser().then((res)=>{
        if(res){
            setisLoggedIn(true)
            setUser(res)
        }
        else{
            setisLoggedIn(false)
            setUser(null)
        }
      })
      .catch((error)=>console.log(error))
      .finally(()=>{
        setisLoading(false)
      })
    }, [])
    
    return(
        <GlobalContext.Provider value={{
            isLoggedIn,setisLoggedIn,User,setUser,isLoading,
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

