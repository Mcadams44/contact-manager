import React, { useState } from 'react';

function EditContactModal({ contact, closeModal, updateContact }) {
    const [editedContact, setEditedContact] = useState(contact);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedContact(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = () => {
        // Save the edited contact to backend
        fetch(`http://localhost:3000/contacts/${editedContact.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editedContact)
        })
        .then(response => response.json())
        .then(updatedContact => {
            updateContact(updatedContact);
            closeModal();
        })
        .catch(err => console.error('Error updating contact:', err));
    };

    return (
        <div className="modal-content">
            <h2>Edit Contact</h2>
            <form>
                <label>Name</label>
                <input 
                    type="text" 
                    name="name" 
                    value={editedContact.name} 
                    onChange={handleInputChange} 
                />
                <label>Email</label>
                <input 
                    type="email" 
                    name="email" 
                    value={editedContact.email} 
                    onChange={handleInputChange} 
                />
                <label>Phone</label>
                <input 
                    type="text" 
                    name="phone" 
                    value={editedContact.phone} 
                    onChange={handleInputChange} 
                />
                <label>Favorite</label>
                <input 
                    type="checkbox" 
                    name="isFavorite" 
                    checked={editedContact.isFavorite} 
                    onChange={() => setEditedContact(prevState => ({ 
                        ...prevState, 
                        isFavorite: !prevState.isFavorite 
                    }))} 
                />
                <button type="button" onClick={handleSave}>Save</button>
                <button type="button" onClick={closeModal}>Cancel</button>
            </form>
        </div>
    );
}

export default EditContactModal;
