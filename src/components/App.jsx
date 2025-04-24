import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "../pages/Navbar";
import Intro from "../pages/Intro";
import ContactDetails from "../pages/ContactDetails";
import ContactsListPage from "../pages/ContactsListPage";
import AddContact from "../pages/AddContact";
import EditPage from "../pages/EditPage";
import FavoriteContacts from "../pages/FavoriteContacts";
import React, { useState } from "react";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/contacts" element={<ContactsListPage />} />
        <Route path="/contacts/:id" element={<ContactDetails />} />
        <Route path="/add" element={<AddContact />} />
        <Route path="/edit/:id" element={<EditPage />} />
        <Route path="/favorites" element={<FavoriteContacts />} />
      </Routes>
    </Router>
  );
}

export default App;
