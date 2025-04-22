import React from 'react'

const ContactFilter = ( filterUser ) => {
  return (
    <select name="select filter" id="" className="form-select" onChange={(e) => filterUser.filterUser(e.target.value)}>
        <option value=""></option>
        <option value="favorite">Favorite</option>
        <option value="blocked">Blocked</option>
    </select>
  )
}
export default ContactFilter