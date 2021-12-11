import NewMenuItemModal from './NewMenuItemModal'
import MenuList from './MenuList'

const Menu = (props) => (
  <>
    <h1>Menu</h1>
    <div className="panel"><button onClick={props.showAddMenuItemModal}>Add Item</button></div>
    <NewMenuItemModal
      visible={props.showModal}
      close={props.hideAddMenuItemModal}
      handleInput={props.handleInput}
      submit={props.addNewMenuItem} />
    <MenuList foods={props.dbData} removeMenuItem={props.removeMenuItem} />
  </>
)

export default Menu
