import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AddContact from './AddContact';
import Searchbar from './Searchbar';
import ContactFilter from './ContactFilter';
import { MdModeEdit, MdDeleteForever, MdBlock } from "react-icons/md";
import { GoBlocked } from "react-icons/go";
import { TbLockOpen } from "react-icons/tb";
import { FaStar } from "react-icons/fa";
import ReactModal from 'react-modal';

ReactModal.setAppElement('#root');

function ContactsListPage() {
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteStatus, setDeleteStatus] = useState(null);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [searchedContacts, setSearchedContacts] = useState([]);
    const [activeFilter, setActiveFilter] = useState("");
    const [modalIsOpen, setIsOpen] = useState(false);

    const [isEditMode, setIsEditMode] = useState(false);
    const [currentContact, setCurrentContact] = useState(null);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
        setIsEditMode(false);
        setCurrentContact(null);
    }

    const handleAddContact = (newContact) => {
        setContacts(prevContacts => [...prevContacts, newContact]);
        if (activeFilter === "") {
            setFilteredContacts(prevFiltered => [...prevFiltered, newContact]);
        } else if (activeFilter === "favorite" && newContact.isFavorite) {
            setFilteredContacts(prevFiltered => [...prevFiltered, newContact]);
        } else if (activeFilter === "blocked" && newContact.isBlocked) {
            setFilteredContacts(prevFiltered => [...prevFiltered, newContact]);
        }
    };

    const handleEditClick = (contact) => {
        setCurrentContact(contact);
        setIsEditMode(true);
        openModal();
    };

    const handleSaveContact = (updatedContact) => {
        fetch(`http://localhost:3000/contacts/${updatedContact.id}`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedContact)
        })
        .then(res => res.json())
        .then(data => {
            const updatedList = contacts.map(contact => 
                contact.id === data.id ? data : contact
            );
            setContacts(updatedList);
            setFilteredContacts(updatedList);
            closeModal();
        })
        .catch(err => console.error("Failed to update contact:", err));
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (deleteStatus) setDeleteStatus(null);
        }, 3000);
        return () => clearTimeout(timeoutId);
    }, [deleteStatus]);

    useEffect(() => {
        fetch('http://localhost:3000/contacts')
        .then(res => res.json())
        .then(data => {
            setContacts(data);
            setFilteredContacts(data);
            setTimeout(() => setIsLoading(false), 2000);
        })
        .catch(err => {
            console.error(err);
            setIsLoading(false);
        });
    }, []);

    useEffect(() => {
        setSearchedContacts(contacts);
    }, [contacts]);

    const filterUser = (filterType) => {
        setActiveFilter(filterType);
        if (filterType === "") {
            setFilteredContacts([...contacts]);
        } else if (filterType === "favorite") {
            const favorites = contacts.filter(contact => contact.isFavorite === true || contact.isFavorite === "true");
            setFilteredContacts(favorites);
        } else if (filterType === "blocked") {
            const blocked = contacts.filter(contact => contact.isBlocked === true || contact.isBlocked === "true");
            setFilteredContacts(blocked);
        }
    };

    const handleDelete = (contactId) => {
        fetch(`http://localhost:3000/contacts/${contactId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                const updated = contacts.filter(c => c.id !== contactId);
                setContacts(updated);
                setFilteredContacts(updated);
                setDeleteStatus('success');
            } else {
                setDeleteStatus('error');
            }
        })
        .catch(() => setDeleteStatus('error'));
    };

    const handleToggleBlocked = (contactId, currentBlockedStatus) => {
        fetch(`http://localhost:3000/contacts/${contactId}`, {
            method: 'PATCH',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isBlocked: !currentBlockedStatus })
        })
        .then(res => res.json())
        .then(updatedContact => {
            const updated = contacts.map(c => c.id === contactId ? updatedContact : c);
            setContacts(updated);
            setFilteredContacts(updated);
        });
    };

    const onSearch = (value) => {
        if (value === "") return setSearchedContacts(contacts);
        setSearchedContacts(contacts.filter(c => c.name.toLowerCase().includes(value.toLowerCase())));
    };

    if (isLoading) return <h1 className="isloading">Loading...</h1>;

    const displayedContacts = activeFilter !== "" ? filteredContacts : searchedContacts;

    return (
        <>
        <div className="contact-list-container">
            <h1 className="contact-list-title">Contact List</h1>

            <div className="search-filter-container">
                <Searchbar onSearch={onSearch} />
                <ContactFilter filterUser={filterUser} activeFilter={activeFilter} />
                {activeFilter && (
                    <button onClick={() => filterUser("")} className="clear-filter-btn">
                        Clear Filter
                    </button>
                )}
            </div>

            <div className="contact-list-actions">
                <button className="add-contact-btn" onClick={openModal}>
                    Add New Contact
                </button>
            </div>

            {activeFilter && (
                <div className="filter-status">
                    Showing {activeFilter} contacts ({filteredContacts.length})
                </div>
            )}

            <div className="contact-list">
                {displayedContacts?.length > 0 ? (
                    displayedContacts.map(contact => (
                        <div key={contact.id} className="contact-card">
                            <Link className='no-underline' to={`/contacts/${contact.id}`}>
                                <div className="contact-info">
                                    <h3>
                                        {contact.name}
                                        {contact.isFavorite && <FaStar className="favorite-icon" />}
                                        {contact.isBlocked && <MdBlock className='blocked' />}
                                    </h3>
                                    <p>Phone: {contact.phone}</p>
                                    <p>Email: {contact.email}</p>
                                </div>
                            </Link>
                            <div className="contact-actions">
                                <button className="edit-btn" onClick={() => handleEditClick(contact)}>
                                    <MdModeEdit />
                                </button>
                                <button className='delete-btn' onClick={() => handleDelete(contact.id)}>
                                    <MdDeleteForever />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleToggleBlocked(contact.id, contact.isBlocked)}
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
            onRequestClose={closeModal}
        >
            <AddContact
                closeModal={closeModal}
                onAddContact={isEditMode ? handleSaveContact : handleAddContact}
                existingContact={isEditMode ? currentContact : null}
            />
        </ReactModal>
        </>
    );
}

export default ContactsListPage;
