import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

const AddMenuItem = (props) => (
  <div id="add-menu-item">
    <h1>Add a new Menu Item</h1>
    <form onSubmit={props.submit}>
      <div><Button variant="outlined" onClick={props.close}>Go back</Button></div>
      <div>
        <TextField variant="standard" type="text" id="title" name="title" label="Title" onChange={props.handleInput} />
      </div>
      <div>
        <TextField variant="standard" id="desc" name="desc" cols="40" rows="10" label="Description" onChange={props.handleInput} multiline />
      </div>
      <div>
        <TextField variant="standard" type="file" id="img" name="img" label="Image" accept="image/png, image/jpeg" onChange={props.handleInput} />
      </div>
      <div className="panel">
        <Button variant="contained" type="submit">Add</Button>
      </div>
    </form>
  </div>
)

export default AddMenuItem;
