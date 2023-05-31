import React, { createContext, useState, useEffect } from 'react'
import { auth } from '../functions/functions'
export const NumblockListContext = createContext()

export const NumblockListContextWrapper = ({ children }) => {
  const [token, setToken] = useState()
  useEffect(() => {
    auth().then((token) => setToken(token))
  }, [])
  
  return (
  <NumblockListContext.Provider value={ [token] }>
    {children}
  </NumblockListContext.Provider>
  )
}