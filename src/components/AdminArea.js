import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getDatabase, ref, onValue } from "firebase/database";
import { initializeApp } from "firebase/app"
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth'
import QRCode from "react-qr-code"
import { firebaseConfig } from '../firebase.js'
import Container from '@mui/material/Container'
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';

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
        <Container sx={{m: "1em"}}>
          <table>
            <tbody>
              <tr>
                <th>Email</th>
                <td>{dbData.email}</td>
              </tr>
              <tr>
                <th>Enabled</th>
                <td>{dbData.enabled ? <DoneRoundedIcon /> : 'no'}</td>
              </tr>
            </tbody>
          </table>
        </Container>
        <Container id="qrcode" sx={{m: "1em"}}>
          {dbData.url && <QRCode value={dbData.url} />}
        </Container>
        <Container id="qrcode" sx={{m: "1em"}}>
          <Link to="/menu-admin">Go to the Menu</Link>
        </Container>
      </div>
    </>
  )
}

export default AdminArea
