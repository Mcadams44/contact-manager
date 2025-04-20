import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AddContact from './AddContact'

function ContactsListPage() {
    const [contacts, setContacts] = useState([])
    const [isloading, setisLoading] = useState(true)

    useEffect(() => {
        fetch('http://localhost:3000/contacts')
        .then(response => response.json())
        .then(data =>{
            setContacts(data)
            setTimeout(()=>{
                setisLoading(false)
            },3000)
        })
        .catch(err => {
            console.log(err)
            setisLoading(false)
        } )
    }, [])

    if (isloading) return <h1 className="isloading">Loading...</h1>

    return (
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
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ContactsListPage