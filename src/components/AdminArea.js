import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getDatabase, ref, onValue } from "firebase/database";
import { initializeApp } from "firebase/app"
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth'
import QRCode from "react-qr-code"
import { firebaseConfig } from '../firebase.js'

const AdminArea = (props) => {
  const [dbData, setDbData] = useState({})

  useEffect(() => {
    const app = initializeApp(firebaseConfig)
    const db = getDatabase(app)
    const authentication = getAuth(app)
    setPersistence(authentication, browserSessionPersistence).then(() => {
      const accountInfoRef = ref(db, `/users/${authentication.currentUser.uid}/accountInfo`)
      onValue(accountInfoRef, (snapshot) => {
        setDbData((prevData) => ({...prevData, ...snapshot.val(), url: `/users/${authentication.currentUser.uid}/menu`}))
      })

      const accountPoliciesRef = ref(db, `/users/${authentication.currentUser.uid}/accountPolicies`)
      onValue(accountPoliciesRef, (snapshot) => {
        setDbData((prevData) => ({...prevData, ...snapshot.val()}))
      })
    })
  }, [])

  return (
    <>
      <div id="admin-data">
        <div>
          <div>Email</div>
          <div>{dbData.email}</div>
        </div>
        <div>
          <div>Enabled</div>
          <div>{dbData.enabled ? 'yes' : 'no'}</div>
        </div>
        <div id="qrcode">
          {dbData.url && <QRCode value={dbData.url} />}
        </div>
        <div><Link to="/menu-admin">Go to the Menu</Link></div>
      </div>
    </>
  )
}

export default AdminArea
