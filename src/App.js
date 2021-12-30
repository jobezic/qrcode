import './App.css';
import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate, Outlet, useParams } from "react-router-dom"
import { toBase64 } from './utils.js'
import { firebaseConfig } from './firebase.js'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, push, update, remove } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, setPersistence, browserSessionPersistence } from 'firebase/auth'
import UserBar from './components/UserBar'
import Menu from './components/Menu'
import MenuList from './components/MenuList'
import Login from './components/Login'
import SignUp from './components/SignUp'
import AdminArea from './components/AdminArea'
import AddMenuItem from './components/AddMenuItem'
import { pathToTitle } from './utils'


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
  return <><UserBar title={pathToTitle(location.pathname)} /><Outlet /></>;
}

const MenuReaders = (props) => {
  const [dbData, setDbData] = useState([])
  const params = useParams()

  useEffect(() => {
    const dbRef = ref(db, `/users/${params.id}/menu`)
    onValue(dbRef, (snapshot) => {
      setDbData(snapshot.val())
    })
  }, [params])

  return <MenuList foods={dbData} />
}

const MenuUser = (props) => {
  const [dbData, setDbData] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const authentication = getAuth(app)
    let mounted = true
    setPersistence(authentication, browserSessionPersistence).then(() => {
      const dbRef = ref(db, `/users/${authentication.currentUser.uid}/menu`)
      onValue(dbRef, (snapshot) => {
        if (mounted) {
          setDbData(snapshot.val())
        }
      })
    })
    return () => mounted = false
  }, [])

  const removeMenuItem = (id) => async() => {
    const authentication = getAuth(app)
    await setPersistence(authentication, browserSessionPersistence)

    const menuItemRef = ref(db, `/users/${authentication.currentUser.uid}/menu/${id}`)
    try {
      remove(menuItemRef);
    } catch (error) {
      // handle error
    }
  }

  const showAddMenuItem = () => navigate("/add-menu-item")

  return <Menu dbData={dbData} removeMenuItem={removeMenuItem} showAddMenuItem={showAddMenuItem} />
}

function App() {
  const [signupData, setSignupData] = useState(null)
  const [loginData, setLoginData] = useState(null)
  const [newItemData, setNewItemData] = useState(null)
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

  const closeAddMenuItem = () => navigate('menu-admin')

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

  const addNewMenuItem = async (event) => {
    event.preventDefault()

    const authentication = getAuth(app)
    await setPersistence(authentication, browserSessionPersistence)

    const menuRef = ref(db, `/users/${authentication.currentUser.uid}/menu`)
    const newMenuKey = push(menuRef).key;
    try {
      update(menuRef, {[newMenuKey]: newItemData});
      navigate('menu-admin')
    } catch (error) {
      // handle error
    }
    setNewItemData(null)
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login handleInput={handleInputLogin} submit={login} />} />
        <Route path="/signup" element={<SignUp handleInput={handleInputSignup} submit={signup} />} />
        <Route path="/menu/:id" element={<MenuReaders />} />
        <Route element={<RequireAuth />}>
          <Route path="/" element={<AdminArea app={app} />} />
          <Route path="/menu-admin" element={<MenuUser />} />
          <Route path="/add-menu-item" element={<AddMenuItem close={closeAddMenuItem} handleInput={handleInputNewItem} submit={addNewMenuItem} />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
