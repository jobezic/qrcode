import { createContext } from 'react'

const isLoggedin = () => Boolean(sessionStorage.getItem("Auth Token"))

const AuthContext = createContext({
  isLoggedin: false
})

const AuthProvider = (props) => (
  <AuthContext.Provider value={{ isLoggedin: isLoggedin() }}>
    {props.children}
  </AuthContext.Provider>
)

export default AuthContext
export { AuthProvider }
