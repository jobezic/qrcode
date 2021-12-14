import './App.css';
import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate, Outlet } from "react-router-dom"
import { toBase64 } from './utils.js'
import { firebaseConfig, DB_URI } from './firebase.js'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set} from "firebase/database";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import Menu from './components/Menu'
import Login from './components/Login'
import SignUp from './components/SignUp'


const app = initializeApp(firebaseConfig)
const db = getDatabase(app)
const starCountRef = ref(db, DB_URI) // TODO: change user on login

function RequireAuth() {
  let location = useLocation();

  if (!sessionStorage.getItem("Auth Token")) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return <Outlet />;
}

function App() {
  const [showModal, setShowModal] = useState(null)
  const [newItemData, setNewItemData] = useState(null)
  const [signupData, setSignupData] = useState(null)
  const [loginData, setLoginData] = useState(null)
  const [dbData, setDbData] = useState([])
  const navigate = useNavigate()

  const showAddMenuItemModal = () => setShowModal(true)
  const hideAddMenuItemModal = () => setShowModal(false)

  useEffect(() => {
    onValue(starCountRef, (snapshot) => {
      setDbData(snapshot.val())
    })
  }, [])

  const handleInputNewItem = async (event) => {
    const {name, value} = event.target

    let data;
    if (name === "img") {
      data = await toBase64(event.target.files[0])
    } else {
      data = value
    }

    setNewItemData((prevData) => ({...prevData, [name]: data}))
  }

  const handleInputSignup = async (event) => {
    const {name, value} = event.target

    setSignupData((prevData) => ({...prevData, [name]: value}))
  }

  const handleInputLogin = async (event) => {
    const {name, value} = event.target

    setLoginData((prevData) => ({...prevData, [name]: value}))
  }

  const addNewMenuItem = () => {
    // TODO: write data somewhere

    // const newPostRef = push(starCountRef);
    // set(newPostRef, newItemData);

    newItemData.id = Math.random().toString(36).substr(2) // generate a random id

    console.log(newItemData)

    set(starCountRef, [...dbData, newItemData])

    setNewItemData(null)
    setShowModal(false)
  }

  const removeMenuItem = (id) => () => {
    const newData = dbData.filter(item => item.id !== id)
    set(starCountRef, newData)
  }

  const signup = async (event) => {
    event.preventDefault()

    try {
      const authentication = getAuth();
      await createUserWithEmailAndPassword(authentication, signupData.email, signupData.password)
      // TODO: check if successful or not

      navigate("/", { replace: true });
    } catch(error) {
      console.log(error)
    }
  }

  const login = async (event) => {
    event.preventDefault()

    try {
      const authentication = getAuth();
      const response = await signInWithEmailAndPassword(authentication, loginData.email, loginData.password)
      const token = response._tokenResponse.refreshToken
      sessionStorage.setItem("Auth Token", token)
      navigate("/", { replace: true });
    } catch {
      // TODO: show error
    }
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login handleInput={handleInputLogin} submit={login} />} />
        <Route path="/signup" element={<SignUp handleInput={handleInputSignup} submit={signup} />} />
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Menu showAddMenuItemModal={showAddMenuItemModal}
                                             showModal={showModal}
                                             hideAddMenuItemModal={hideAddMenuItemModal}
                                             handleInput={handleInputNewItem}
                                             addNewMenuItem={addNewMenuItem}
                                             dbData={dbData}
                                             removeMenuItem={removeMenuItem} />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
