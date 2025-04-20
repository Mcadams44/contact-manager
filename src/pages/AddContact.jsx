import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
// import { Link, NavLink } from 'react-router-dom';

function AddContact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addStatus, setAddStatus] = useState(null); 

  useEffect(() => {
    if (addStatus) {
      setTimeout(() => {
        setAddStatus(null);
      }, 3000);
    }
    return () => clearTimeout(3000);
  }, [addStatus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsAdding(true);
    
    const newContact = {
      name,
      email,
      phone,
      isFavorite,
      isBlocked,
    };

    fetch('http://localhost:3000/contacts', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(newContact)
    })
    .then(resp => resp.json())
    .then(data => {
      console.log(data, "Added succesfully");
      setName('');
      setEmail('');
      setPhone('');
      setIsFavorite(false);
      setIsBlocked(false);
      setIsAdding(false);
      setAddStatus('success');
    })
    .catch(err => {
      console.log(err);
      setIsAdding(false);
      setAddStatus('error');
    });
  }

  return (
    <>
      <form className='add-contact' onSubmit={handleSubmit}>
        <h1>Add New Contact</h1>
        <input 
          className='new-contact' 
          type="text" 
          placeholder='Enter Name' 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required
        />
        <input  
          className='new-contact' 
          type="email" 
          placeholder='Enter email' 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input  
          className='new-contact' 
          type="tel" 
          pattern="[0-9]{10}" 
          placeholder='Enter Phone number ' 
          maxLength={10} 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)} 
          required
        />
        
        <button 
          type="button" 
          onClick={() => setIsFavorite(!isFavorite)}
          className={isFavorite ? 'favorite-active' : 'favorite-notActive'}
        >
          {isFavorite ? 'Remove as favorite ★' : 'Set as Favorite ☆'}
        </button>
        
        <button 
          type="button" 
          onClick={() => setIsBlocked(!isBlocked)}
          className="block-container"
        >
          <img src="img/block.png" alt="block" className='block' />
          <span className="block-text">{isBlocked ? 'Unblock' : 'Block'}</span>
        </button>
        
        <button 
          type="submit" 
          className='submit-contact' 
          disabled={isAdding}
        >
          {isAdding ? 'Adding...' : 'Add Contact'}
        </button>
      </form>
      <Link to="/contacts">
      <button className='backHome'>Go back Home</button></Link>
      
      {addStatus && (
        <div className="notification-container">
          <div className={addStatus === 'success' ? 'contact-added' : 'contact-notAdded'}>
            <span>
              {addStatus === 'success' 
                ? 'Contact added successfully' 
                : 'Failed to add contact. Try again later.'}
            </span>
          </div>
        </div>
      )}
    </>
  )
}

export default AddContact