import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReactDOM from 'react-dom';
import BookingForm from './BookingForm.jsx';
import App from './App';

export default function router() {
    return (
        <Router>
        <div className = "router">
            <Routes>
                <Route index path ="/" element={<App />}>
                    <Route exact path ="/book" element={<BookingForm />} />
                </Route> 
            </Routes>
        </div>
        </Router>
    );
}