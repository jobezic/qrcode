import Button from '@mui/material/Button'
import MenuList from './MenuList'

const Menu = (props) => (
  <>
    <h1>Menu</h1>
    <div className="panel"><Button variant="contained" onClick={props.showAddMenuItem}>Add Item</Button></div>
    <MenuList foods={props.dbData} removeMenuItem={props.removeMenuItem} />
  </>
)

export default Menu
