const NewMenuItemModal = (props) => {
  if (!props.visible) {
    return null
  }

  return (
    <div className="modal">
      <h1>Add a new Menu Item</h1>
      <div><button onClick={props.close}>Close</button></div>
      <div>
        <label htmlFor="name">Name</label>
        <input type="text" id="title" name="title" onChange={props.handleInput} />
      </div>
      <div>
        <label htmlFor="desc">Description</label>
        <textarea id="desc" name="desc" cols="40" rows="10" onChange={props.handleInput} />
      </div>
      <div>
        <label htmlFor="img">Image</label>
        <input type="file" id="img" name="img" accept="image/png, image/jpeg" onChange={props.handleInput} />
      </div>
      <div className="panel">
        <button onClick={props.submit}>Add</button>
      </div>
    </div>
  )
}

export default NewMenuItemModal;
