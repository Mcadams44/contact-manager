import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AddContact from './AddContact'
import Searchbar from './Searchbar'
import { MdModeEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { GoBlocked } from "react-icons/go";
import { TbLockOpen } from "react-icons/tb";
import { MdBlock } from "react-icons/md";
import { MdFavorite } from "react-icons/md";

function ContactsListPage() {
    const [contacts, setContacts] = useState([])
    const [isloading, setisLoading] = useState(true)
    const [deleteStatus, setDeleteStatus] = useState(null)
    const [isBlocked, setIsBlocked] = useState(false)
    // const [filteredContacts, setFilteredContacts] = useState([])

    // const handlesearch =(searchTerm)=>{
    //     const newFilteredContact = contacts.filter(contact => contact.toLowercase().includes(searchTerm.toLowercase()))
    // }

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
            }, 2000)
        })
        .catch(err => {
            console.log(err)
            setisLoading(false)
        })
    },[])


    const handleDelete = (contactId) => {
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
            
        })
        .catch(err => {
            console.error('Error deleting contact:', err)
            setDeleteStatus('error');
            
        })
    }

    if (isloading) return <h1 className="isloading">Loading...</h1>

    return (
        <>
        <div className="contact-list-container">
            <h1 className="contact-list-title">Contact List</h1>
            <Searchbar />
            
            <div className="contact-list-actions">
                <Link to="/add" element={AddContact} className="add-contact-btn">
                    Add New Contact
                </Link>
            </div>
            
            <div className="contact-list">
                {contacts.map(contact => (
                    <div key={contact.id} className="contact-card">
                        <Link className='no-underline' to='/contact/:id' >
                        <div className="contact-info">
                            <h3>
                                {contact.name} 
                                {contact.isFavorite && <MdFavorite className='favorite-icon'/>}
                                {contact.isBlocked ? <TbLockOpen className='notBlocked'/> : <MdBlock className='blocked'/>}
                            </h3>
                            <p>Phone: {contact.phone}</p>
                            <p>Email: {contact.email}</p>
                        </div>
                        </Link>
                        <div className="contact-actions">
                            <Link to={`/edit/${contact.id}`} className="edit-btn">
                        
                                <MdModeEdit />
                            </Link>
                            <button 
                                className='delete-btn' 
                                onClick={() => handleDelete(contact.id)}
                            >
                                <MdDeleteForever />
                            </button>
                            <button 
                              type="button" 
                              onClick={() => setIsBlocked(!isBlocked)}
                              className='block-btn'
                            >
                                <GoBlocked />
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