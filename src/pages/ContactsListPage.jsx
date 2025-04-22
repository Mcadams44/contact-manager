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
import { FaStar } from "react-icons/fa";
import ReactModal from 'react-modal'

// const customStyles = {
//     content: {
//         top: '50%',
//         left: '50%',
//       right: 'auto',
//       bottom: 'auto',
//       marginRight: '-50%',
//       transform: 'translate(-50%, -50%)',
//     },
// };

function ContactsListPage() {
    const [contacts, setContacts] = useState([])
    const [isloading, setisLoading] = useState(true)
    const [deleteStatus, setDeleteStatus] = useState(null)
    const [filteredContacts, setFilteredContacts] = useState([])
    const [activeFilter, setActiveFilter] = useState("")
    const [modalIsOpen, setIsOpen] = React.useState(false);
    // let subtitle;
    
    function openModal() {
    setIsOpen(true);
  }

  // references are now sync'd and can be accessed.
//   function afterOpenModal() {
//     subtitle.style.color = '#f00';
//   }

  function closeModal() {
    setIsOpen(false);
  }


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
            console.log("Loaded contacts:", data); 
            setContacts(data)
            setFilteredContacts(data) 
            setTimeout(() => {
                setisLoading(false)
            }, 2000)
        })
        .catch(err => {
            console.log(err)
            setisLoading(false)
        })
    },[])

    const filterUser = (filterType) => {
        console.log("Filtering by:", filterType);
        
        setActiveFilter(filterType);
        
        if (filterType === "") {
            setFilteredContacts([...contacts]);
            console.log("Showing all contacts:", contacts.length);
        } else if (filterType === "favorite") {

            const favorites = contacts.filter(contact => 
                contact.isFavorite === true || contact.isFavorite === "true"
            );
            console.log("Filtered favorites:", favorites.length);
            setFilteredContacts(favorites);
        } else if (filterType === "blocked") {
            const blocked = contacts.filter(contact => 
                contact.isBlocked === true || contact.isBlocked === "true"
            );
            console.log("Filtered blocked:", blocked.length);
            setFilteredContacts(blocked);
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
   
    const handleToggleBlocked = (contact) => {
        fetch(`http://localhost:3000/contacts/${contact.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                isBlocked: true/false
            })
        })
        .then(response => response.json())
        // .then(updatedContact => {
        //     // Update contact in state
        //     const updatedContacts = contacts.map(contact => 
        //         contact.id === contact.id ? updatedContact : contact
        //     );
        //     setContacts(updatedContacts);
            
        //     filterUser(activeFilter);
        // })
        .catch(err => console.error('Error updating contact:', err));
    };


    if (isloading) return <h1 className="isloading">Loading...</h1>

    const displayedContacts = activeFilter !== "" ? filteredContacts : contacts;

    return (
        <>
        <div className="contact-list-container">
            <h1 className="contact-list-title">Contact List</h1>
            
            <div className="search-filter-container">
                <Searchbar />
                <ContactFilter filterUser={filterUser} activeFilter={activeFilter}/>
                {activeFilter && (
                    <button 
                        onClick={() => filterUser("")} 
                        className="clear-filter-btn"
                    >
                        Clear Filter
                    </button>
                )}
            </div>
            
            <div className="contact-list-actions">
                <button className="add-contact-btn" onClick={openModal}>
                    Add New Contact
                </button>
                
            </div>
            
            {/* Display status if filtering is active */}
            {activeFilter && (
                <div className="filter-status">
                    Showing {activeFilter} contacts ({filteredContacts.length})
                </div>
            )}
            
            <div className="contact-list">
                {displayedContacts.length > 0 ? (
                    displayedContacts.map(contact => (
                        <div key={contact.id} className="contact-card">
                            <Link className='no-underline' to={`/contact/${contact.id}`}>
                                <div className="contact-info">
                                    <h3>
                                        {contact.name} 
                                        {contact.isFavorite && <FaStar className="favorite-icon"/>}
                                        {contact.isBlocked && <MdBlock className='blocked'/>}
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
                                    onClick={handleToggleBlocked}
                                    className='block-btn'
                                    title={contact.isBlocked ? "Unblock Contact" : "Block Contact"}
                                >
                                    {contact.isBlocked ? <TbLockOpen /> : <GoBlocked />}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
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

        <ReactModal
                isOpen={modalIsOpen}
                // onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                // style={customStyles}
        >
            <AddContact closeModal={closeModal}/>
        </ReactModal>
        </>
    )
}

export default ContactsListPage