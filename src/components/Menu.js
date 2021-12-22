import Button from '@mui/material/Button'
import NewMenuItemModal from './NewMenuItemModal'
import MenuList from './MenuList'

const Menu = (props) => (
  <>
    <h1>Menu</h1>
    <div className="panel"><Button variant="contained" onClick={props.showAddMenuItemModal}>Add Item</Button></div>
    <NewMenuItemModal
      visible={props.showModal}
      close={props.hideAddMenuItemModal}
      handleInput={props.handleInput}
      submit={props.addNewMenuItem} />
    <MenuList foods={props.dbData} removeMenuItem={props.removeMenuItem} />
  </>
)

export default Menu
