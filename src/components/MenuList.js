import MenuItem from './MenuItem'

const MenuList = (props) => (
  <>
    { props.foods && Object.entries(props.foods).map(([id, data]) =>
      <MenuItem key={id} dish={data} removeMenuItem={props.removeMenuItem && props.removeMenuItem(id)} />) }
  </>
)

export default MenuList
