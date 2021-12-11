const SignUp = (props) => (
  <div id="signup">
    <h1>Sign Up</h1>
    <form onSubmit={props.submit}>
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" onChange={props.handleInput} required />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" onChange={props.handleInput} required />
      </div>
      <div className="panel">
        <button type="submit">Register</button>
      </div>
    </form>
  </div>
)

export default SignUp
