import './App.css';
import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate, Outlet, useParams } from "react-router-dom"
import { toBase64 } from './utils.js'
import { firebaseConfig } from './firebase.js'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set} from "firebase/database";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, setPersistence, browserSessionPersistence } from 'firebase/auth'
import Menu from './components/Menu'
import MenuList from './components/MenuList'
import Login from './components/Login'
import SignUp from './components/SignUp'


const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

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

const MenuReaders = (props) => {
  const [dbData, setDbData] = useState([])
  const params = useParams()
  const dbRef = ref(db, `/users/${params.id}/menu`)

  useEffect(() => {
    onValue(dbRef, (snapshot) => {
      setDbData(snapshot.val())
    })
  }, [])

  return <MenuList foods={dbData} />
}

const MenuUser = (props) => {
  const [dbData, setDbData] = useState([])
  const [showModal, setShowModal] = useState(null)
  const [newItemData, setNewItemData] = useState(null)
  const showAddMenuItemModal = () => setShowModal(true)
  const hideAddMenuItemModal = () => setShowModal(false)
  const authentication = getAuth(app)

  useEffect(() => {
    setPersistence(authentication, browserSessionPersistence).then(() => {
      const dbRef = ref(db, `/users/${authentication.currentUser.uid}/menu`)
      onValue(dbRef, (snapshot) => {
        setDbData(snapshot.val())
      })
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

  const addNewMenuItem = async () => {
    newItemData.id = Math.random().toString(36).substr(2) // generate a random id

    const authentication = getAuth(app)
    await setPersistence(authentication, browserSessionPersistence)

    const menuRef = ref(db, `/users/${authentication.currentUser.uid}/menu`)
    set(menuRef, [...dbData, newItemData])

    setNewItemData(null)
    setShowModal(false)
  }

  const removeMenuItem = (id) => async() => {
    const newData = dbData.filter(item => item.id !== id)
    const authentication = getAuth(app)
    await setPersistence(authentication, browserSessionPersistence)
    const dbRef = ref(db, `/users/${authentication.currentUser.uid}/menu`)

    set(dbRef, newData)
  }

  return <Menu showAddMenuItemModal={showAddMenuItemModal}
               showModal={showModal}
               hideAddMenuItemModal={hideAddMenuItemModal}
               handleInput={handleInputNewItem}
               addNewMenuItem={addNewMenuItem}
               dbData={dbData}
               removeMenuItem={removeMenuItem} />
}

function App() {
  const [signupData, setSignupData] = useState(null)
  const [loginData, setLoginData] = useState(null)
  const navigate = useNavigate()

  const handleInputSignup = async (event) => {
    const {name, value} = event.target

    setSignupData((prevData) => ({...prevData, [name]: value}))
  }

  const handleInputLogin = async (event) => {
    const {name, value} = event.target

    setLoginData((prevData) => ({...prevData, [name]: value}))
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
      await setPersistence(authentication, browserSessionPersistence)
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
        <Route path="/menu/:id" element={<MenuReaders />} />
        <Route element={<RequireAuth />}>
          <Route path="/" element={<MenuUser />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
