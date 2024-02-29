"use client"

import React, {useContext, createContext, useState, useEffect} from 'react'
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '/firebase.ts';
import { createUser } from '@/firebase/actions';

const AuthContext = createContext();


export const AuthContextProvider = ({children}) => {
  const [user, setUser] = useState(null)

  //Google sign in function
    const googleSignIn = () =>{
      const provider = new GoogleAuthProvider()
      signInWithPopup(auth, provider);
      onAuthStateChanged(auth, (currentUser) =>{
      createUser(currentUser);
      })
    }

    //User logout function
    const logOut = () =>{
      signOut(auth);
    }

    useEffect(() =>{
      const unsubscribe = onAuthStateChanged(auth, (currentUser) =>{
        setUser(currentUser)
      })
      return() => unsubscribe();
    }, [user])


  return (
    <AuthContext.Provider value={{user, googleSignIn,logOut}}>{children}</AuthContext.Provider>
  )
}


//Get current User function
export const UserAuth = () => {
  return useContext(AuthContext)
}
