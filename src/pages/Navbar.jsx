import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <div className='Navbar'>
      <div className="left-section">
        <Link to="/">
          <img className='logo' src="img/phone-call.png" alt="Contact manager" />
        </Link>
        <h2 className='webname'>Contact Manager</h2>
      </div>
      
      <div className="actions">
        <Link to="/add">
          <img className='add' src="img/phone.png" alt="Add Contact" />
        </Link>
        <Link to="/contacts">
          <img className='details' src="img/info.png" alt="Contact Details" />
        </Link>
      </div>
    </div>
  )
}

export default Navbar