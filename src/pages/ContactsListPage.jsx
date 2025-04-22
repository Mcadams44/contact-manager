import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AddContact from './AddContact'

function ContactsListPage() {
    const [contacts, setContacts] = useState([])
    const [isloading, setisLoading] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteStatus, setDeleteStatus] = useState(null)

    useEffect(() => {
        const timeoutId = ()=>{
        if (deleteStatus) {
            setTimeout(() => {
                setDeleteStatus(null)
            }, 3000);
        }}
        return () => {
            if (timeoutId) clearTimeout(timeoutId)
        }
    }, [deleteStatus]);

    useEffect(() => {
        fetch('http://localhost:3000/contacts')
        .then(response => response.json())
        .then(data => {
            setContacts(data)
            setTimeout(() => {
                setisLoading(false)
            }, 3000)
        })
        .catch(err => {
            console.log(err)
            setisLoading(false)
        })
    },[])


    const handleDelete = (contactId) => {
        setIsDeleting(true)
        fetch(`http://localhost:3000/contacts/${contactId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                setContacts(contacts.filter(contact => contact.id !== contactId))
            } else {
                console.error('Failed to delete contact')
                setDeleteStatus('error')
            }
            setIsDeleting(false)
        })
        .catch(err => {
            console.error('Error deleting contact:', err)
            setDeleteStatus('error');
            setIsDeleting(false)
        })
    }

    if (isloading) return <h1 className="isloading">Loading...</h1>

    return (
        <>
        <div className="contact-list-container">
            <h1 className="contact-list-title">Contact List</h1>
            
            <div className="contact-list-actions">
                <Link to="/add" element={AddContact} className="add-contact-btn">
                    Add New Contact
                </Link>
            </div>
            
            <div className="contact-list">
                {contacts.map(contact => (
                    <div key={contact.id} className="contact-card">
                        <div className="contact-info">
                            <h3>
                                {contact.name} 
                                {contact.isFavorite && <span className="favorite-icon">⭐</span>}
                            </h3>
                            <p>Phone: {contact.phone}</p>
                            <p>Email: {contact.email}</p>
                        </div>
                        <div className="contact-actions">
                            <Link to={`/contacts/${contact.id}`} className="view-btn">
                                View
                            </Link>
                            <Link to={`/edit/${contact.id}`} className="edit-btn">
                                Edit
                            </Link>
                            <button 
                                className='delete-btn' 
                                onClick={() => handleDelete(contact.id)}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

   {deleteStatus && (
    <div className="notification-container">
      <div className={deleteStatus === 'success' ? 'contact-deleted' : 'contact-notDeleted'}>
        <span>
          {deleteStatus === 'success' 
            ? 'Contact deleted successfully' 
            : 'Failed to delete contact. Try again later.'}
        </span>
      </div>
    </div>
  )}
  </>
    )
}

export default ContactsListPage