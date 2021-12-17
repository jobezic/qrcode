import { useState, useEffect } from 'react'
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth'
import QRCode from "react-qr-code"

const AdminArea = (props) => {
  const [dbData, setDbData] = useState({})

  const db = getDatabase(props.app)
  const authentication = getAuth(props.app)

  useEffect(() => {
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
      <h1>Admin Area</h1>
      <div id="admin-data">
        <table>
          <tbody>
            <tr>
              <td>Email</td>
              <td>{dbData.email}</td>
            </tr>
            <tr>
              <td>Enabled</td>
              <td>{dbData.enabled ? 'yes' : 'no'}</td>
            </tr>
          </tbody>
        </table>
        <div id="qrcode">
          <QRCode value={dbData.url} />
        </div>
      </div>
    </>
  )
}

export default AdminArea
