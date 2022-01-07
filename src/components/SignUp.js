import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Link from '@mui/material/Link'

const SignUp = (props) => (
  <div id="signup">
    <h1>Sign Up</h1>
    <form onSubmit={props.submit}>
      <div>
        <TextField variant="standard" type="email" id="email" name="email" label="Email" onChange={props.handleInput} required />
      </div>
      <div>
        <TextField variant="standard" type="password" id="password" name="password" label="Password" onChange={props.handleInput} required />
      </div>
      <div>
        <FormControlLabel control={<Link><Checkbox required /></Link>} label={<Link href="/privacy">Accept Terms & Conditions</Link>} />
      </div>
      <div className="panel">
        <Button variant="contained" type="submit">Register</Button>
      </div>
    </form>
  </div>
)

export default SignUp
