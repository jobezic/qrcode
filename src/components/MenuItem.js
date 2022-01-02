import Button from '@mui/material/Button'

const MenuItem = (props) => (
  <div className="card">
    <div className="image">
      {props.dish.img ? <img src={props.dish.img} alt="" /> : <img src="/food-tray.png" alt="" width="32" />}
    </div>
    <h3>{props.dish.title}</h3>
    <p>{props.dish.desc}</p>
    {props.removeMenuItem && <Button variant="outlined" onClick={props.removeMenuItem}>Remove</Button>}
  </div>
)

export default MenuItem
