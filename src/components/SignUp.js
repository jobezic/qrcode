import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

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
      <div className="panel">
        <Button variant="contained" type="submit">Register</Button>
      </div>
    </form>
  </div>
)

export default SignUp
