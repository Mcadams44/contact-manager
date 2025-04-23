import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function ContactDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);

  useEffect(() => {
    fetchContact();
  }, [id]);

  const fetchContact = async () => {
    try {
      // Corrected port to match ContactsListPage
      const response = await axios.get(`http://localhost:3000/contacts/${id}`);
      setContact(response.data);
    } catch (error) {
      console.error('Error fetching contact:', error);
    }
  };

  const handleToggleFavorite = async () => {
    const updated = { ...contact, isFavorite: !contact.isFavorite };
    // Corrected port to match ContactsListPage
    await axios.patch(`http://localhost:3000/contacts/${id}`, {
      isFavorite: !contact.isFavorite,
    });
    setContact(updated);
  };

  const handleToggleBlock = async () => {
    const updated = { ...contact, isBlocked: !contact.isBlocked };
    // Corrected port to match ContactsListPage
    await axios.patch(`http://localhost:3000/contacts/${id}`, {
      isBlocked: !contact.isBlocked,
    });
    setContact(updated);
  };

  const handleClose = () => {
    navigate(-1); // Navigates back to the previous page (Contact List or Favorite Contacts)
  };

  if (!contact) return <div>Loading...</div>;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close-btn" onClick={handleClose}>
          ×
        </button>
        <h2>Contact Details</h2>
        <p><strong>Name:</strong> {contact.name}</p>
        <p><strong>Email:</strong> {contact.email}</p>
        <p><strong>Phone:</strong> {contact.phone}</p>
        <p><strong>Favorite:</strong> {contact.isFavorite ? 'Yes' : 'No'}</p>
        <p><strong>Blocked:</strong> {contact.isBlocked ? 'Yes' : 'No'}</p>
        <div className="modal-actions">
          <button className="favorite-btn" onClick={handleToggleFavorite}>
            {contact.isFavorite ? 'Unfavorite' : 'Favorite'}
          </button>
          <button className="block-btn" onClick={handleToggleBlock}>
            {contact.isBlocked ? 'Unblock' : 'Block'}
          </button>
          <Link to={`/edit/${id}`}>
            <button className="edit-btn">Edit</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ContactDetails;