import React, { createContext, useState, useEffect } from 'react'
import { auth, getNumblockList } from '../functions/functions'
export const TokenContext = createContext()

export const TokenContextWrapper = ({ children }) => {
  const [token, setToken] = useState()
  const [numBlockList, setNumBlockList] = useState([])
  useEffect(() => {
    auth().then(async (token) => {
      setToken(token)
      getNumblockList(token).then((list) => setNumBlockList(list))
    })
  }, [])
  
  return (
  <TokenContext.Provider value={ {token, numBlockList, setNumBlockList} }>
    {children}
  </TokenContext.Provider>
  )
}
