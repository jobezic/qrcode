const MenuItem = (props) => (
  <div className="card">
    <div className="image">
      {props.dish.img ? <img src={props.dish.img} alt="" /> : <img src="/food-tray.png" alt="" width="32" />}
    </div>
    <span>{props.dish.title}</span>
    <p>{props.dish.desc}</p>
    {props.removeMenuItem && <button onClick={props.removeMenuItem(props.dish.id)}>Remove</button>}
  </div>
)

export default MenuItem
