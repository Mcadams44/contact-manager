import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AddContact from './AddContact'
import Searchbar from './Searchbar'
import ContactFilter from './ContactFilter'
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
    const [filteredContacts, setFilteredContacts] = useState([])
    const [activeFilter, setActiveFilter] = useState("")

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (deleteStatus) {
                setDeleteStatus(null)
            }
        }, 3000);
        
        return () => {
            clearTimeout(timeoutId)
        }
    }, [deleteStatus]);

    useEffect(() => {
        fetch('http://localhost:3000/contacts')
        .then(response => response.json())
        .then(data => {
            setContacts(data)
            setFilteredContacts(data) // Initialize filtered contacts with all contacts
            setTimeout(() => {
                setisLoading(false)
            }, 2000)
        })
        .catch(err => {
            console.log(err)
            setisLoading(false)
        })
    },[])

    // Contact filter function that will be passed to ContactFilter component
    const filterUser = (filterType) => {
        setActiveFilter(filterType)
        
        if (filterType === "") {
            // Show all contacts when no filter is selected
            setFilteredContacts(contacts)
        } else if (filterType === "favorite") {
            // Filter only favorite contacts
            setFilteredContacts(contacts.filter(contact => contact.isFavorite === true))
        } else if (filterType === "blocked") {
            // Filter only blocked contacts
            setFilteredContacts(contacts.filter(contact => contact.isBlocked === true))
        }
    }

    const handleDelete = (contactId) => {
        fetch(`http://localhost:3000/contacts/${contactId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                const updatedContacts = contacts.filter(contact => contact.id !== contactId)
                setContacts(updatedContacts)
                // Also update filtered contacts to maintain current filter
                setFilteredContacts(prevFiltered => 
                    prevFiltered.filter(contact => contact.id !== contactId)
                )
                setDeleteStatus('success')
            } else {
                console.error('Failed to delete contact')
                setDeleteStatus('error')
            }
            
        })
        .catch(err => {
            console.error('Error deleting contact:', err)
            setDeleteStatus('error')
        })
    }

    if (isloading) return <h1 className="isloading">Loading...</h1>

    return (
        <>
        <div className="contact-list-container">
            <h1 className="contact-list-title">Contact List</h1>
            
            <div className="search-filter-container">
                <Searchbar />
                <ContactFilter filterUser={filterUser} />
            </div>
            
            <div className="contact-list-actions">
                <Link to="/add" element={AddContact} className="add-contact-btn">
                    Add New Contact
                </Link>
                {activeFilter && (
                    <button 
                        onClick={() => filterUser("")} 
                        className="clear-filter-btn"
                    >
                        Clear Filter
                    </button>
                )}
            </div>
            
            <div className="contact-list">
                {(activeFilter ? filteredContacts : contacts).map(contact => (
                    <div key={contact.id} className="contact-card">
                        <Link className='no-underline' to={`/contact/${contact.id}`}>
                        <div className="contact-info">
                            <h3>
                                {contact.name} 
                                {contact.isFavorite && <MdFavorite className='favorite-icon'/>}
                                {contact.isBlocked ? <MdBlock className='blocked'/> : <TbLockOpen className='notBlocked'/>}
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
                              onClick={() => {
                                // Update blocking status for this contact on server
                                fetch(`http://localhost:3000/contacts/${contact.id}`, {
                                    method: 'PATCH',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        isBlocked: !contact.isBlocked
                                    })
                                })
                                .then(response => response.json())
                                .then(updatedContact => {
                                    // Update contact in state
                                    const updatedContacts = contacts.map(c => 
                                        c.id === contact.id ? updatedContact : c
                                    )
                                    setContacts(updatedContacts)
                                    // Update filtered contacts if needed
                                    setFilteredContacts(prevFiltered => 
                                        prevFiltered.map(c => 
                                            c.id === contact.id ? updatedContact : c
                                        )
                                    )
                                })
                                .catch(err => console.error('Error updating contact:', err))
                              }}
                              className='block-btn'
                            >
                                <GoBlocked />
                            </button>
                        </div>
                    </div>
                ))}
                
                {activeFilter && filteredContacts.length === 0 && (
                    <div className="no-results">
                        <p>No {activeFilter} contacts found.</p>
                    </div>
                )}
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