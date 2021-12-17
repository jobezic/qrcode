import MenuItem from './MenuItem'

const MenuList = (props) => (
  <>
    { props.foods && props.foods.map(item => <MenuItem key={item.title} dish={item} removeMenuItem={props.removeMenuItem} />) }
  </>
)

export default MenuList
