import Button from '@mui/material/Button'

const MenuItem = (props) => (
  <div className="card">
    <div className="image">
      {props.dish.img ? <img src={props.dish.img} alt="" width="512" /> : <img src="/food-tray.png" alt="" width="32" />}
    </div>
    <span>{props.dish.title}</span>
    <p>{props.dish.desc}</p>
    {props.removeMenuItem && <Button variant="outlined" onClick={props.removeMenuItem}>Remove</Button>}
  </div>
)

export default MenuItem
