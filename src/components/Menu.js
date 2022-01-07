import Button from '@mui/material/Button'
import MenuList from './MenuList'
import Container from '@mui/material/Container'
import Box from "@mui/material/Box";

const Menu = (props) => {
  if (props.dbData.length === 0) {
    return <h3>Loading...</h3>
  }

  return (
    <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
  >
      <Container sx={{m: "1em"}} maxWidth="sm">
        <h1>Menu</h1>
        {props.showAddMenuItem && <div className="panel">
          <Button variant="contained" onClick={props.showAddMenuItem}>Add Item</Button>
        </div>}
        <MenuList foods={props.dbData} removeMenuItem={props.removeMenuItem} />
      </Container>
    </Box>)
}

export default Menu
