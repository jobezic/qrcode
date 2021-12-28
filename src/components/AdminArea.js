import { useState, useEffect } from 'react'
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth'
import QRCode from "react-qr-code"

const AdminArea = (props) => {
  const [dbData, setDbData] = useState({})

  useEffect(() => {
    const db = getDatabase(props.app)
    const authentication = getAuth(props.app)
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
  }, [props.app])

  return (
    <>
      <UserBar />
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
      </div>
    </>
  )
}

export default AdminArea
