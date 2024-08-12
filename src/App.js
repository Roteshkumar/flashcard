import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Flashcard from './components/Flashcard';
import Dashboard from './components/Dashboard';
import axios from 'axios';

function App() {
  const [flashcards, setFlashcards] = React.useState([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    axios.get('http://localhost:5000/api/flashcards')
      .then(response => setFlashcards(response.data))
      .catch(error => console.error('Error fetching flashcards:', error));
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      flashcards.length > 0 ? (prevIndex === flashcards.length - 1 ? 0 : prevIndex + 1) : 0
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      flashcards.length > 0 ? (prevIndex === 0 ? flashcards.length - 1 : prevIndex - 1) : 0
    );
  };

  const addFlashcard = (question, answer) => {
    axios.post('http://localhost:5000/api/flashcards', { question, answer })
      .then(response => setFlashcards([...flashcards, response.data]))
      .catch(error => console.error('Error adding flashcard:', error));
  };

  const deleteFlashcard = (id) => {
    axios.delete(`http://localhost:5000/api/flashcards/${id}`)
      .then(() => setFlashcards(flashcards.filter(card => card.id !== id)))
      .catch(error => console.error('Error deleting flashcard:', error));
  };

  return (
    <Router>
      <div className="App">
        <div className="sidebar">
          <h2>Menu</h2>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
          </ul>
        </div>
        <div className="content">
          <Routes>
            <Route path="/" element={
              <div>
                <h1>Flashcard Learning Tool</h1>
                {flashcards.length > 0 ? (
                  <Flashcard
                    question={flashcards[currentIndex]?.question || ''}
                    answer={flashcards[currentIndex]?.answer || ''}
                  />
                ) : (
                  <p>No flashcards available</p>
                )}
                <div className="navigation-buttons">
                  <button onClick={handlePrevious} disabled={flashcards.length === 0}>Previous</button>
                  <button onClick={handleNext} disabled={flashcards.length === 0}>Next</button>
                </div>
              </div>
            } />
            <Route path="/dashboard" element={
              <Dashboard flashcards={flashcards} setFlashcards={setFlashcards} addFlashcard={addFlashcard} deleteFlashcard={deleteFlashcard} />
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
