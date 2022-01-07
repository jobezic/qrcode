import { createContext } from 'react'
import { getAuth } from 'firebase/auth'

const isLoggedin = () => Boolean(sessionStorage.getItem("Auth Token"))

const logout = async () => {
  const authentication = getAuth();
  try {
    await authentication.signOut()
    sessionStorage.removeItem("Auth Token")
  } catch {
    // TODO: handle error
  }
}

const AuthContext = createContext({
  isLoggedin: false
})

const AuthProvider = (props) => (
  <AuthContext.Provider value={{ isLoggedin: isLoggedin(), logout: logout }}>
    {props.children}
  </AuthContext.Provider>
)

export default AuthContext
export { AuthProvider }
