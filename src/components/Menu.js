import Button from '@mui/material/Button'
import MenuList from './MenuList'
import Container from '@mui/material/Container'

const Menu = (props) => (
  <Container sx={{m: "1em"}}>
    <h1>Menu</h1>
    {props.showAddMenuItem && <div className="panel">
      <Button variant="contained" onClick={props.showAddMenuItem}>Add Item</Button>
    </div>}
    <MenuList foods={props.dbData} removeMenuItem={props.removeMenuItem} />
  </Container>
)

export default Menu
