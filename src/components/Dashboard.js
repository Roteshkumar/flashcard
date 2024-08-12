import React, { useState } from 'react';
import axios from 'axios';

function Dashboard({ flashcards, setFlashcards }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  const handleAdd = () => {
    if (question && answer) {
      axios.post('http://localhost:5000/api/flashcards', { question, answer })
        .then(response => {
          setFlashcards([...flashcards, response.data]);
          setQuestion('');
          setAnswer('');
        })
        .catch(error => console.error('Error adding flashcard:', error));
    }
  };

  const handleUpdate = () => {
    if (question && answer && editIndex !== null) {
      const updatedCard = { id: flashcards[editIndex].id, question, answer };
      axios.put(`http://localhost:5000/api/flashcards/${flashcards[editIndex].id}`, updatedCard)
        .then(() => {
          const updatedFlashcards = flashcards.map((card, index) =>
            index === editIndex ? updatedCard : card
          );
          setFlashcards(updatedFlashcards);
          setQuestion('');
          setAnswer('');
          setEditIndex(null);
        })
        .catch(error => console.error('Error updating flashcard:', error));
    }
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/flashcards/${id}`)
      .then(() => {
        setFlashcards(flashcards.filter(card => card.id !== id));
      })
      .catch(error => console.error('Error deleting flashcard:', error));
  };

  const handleEdit = (index) => {
    setQuestion(flashcards[index].question);
    setAnswer(flashcards[index].answer);
    setEditIndex(index);
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <div>
        <input
          type="text"
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <input
          type="text"
          placeholder="Answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        {editIndex !== null ? (
          <button onClick={handleUpdate}>Update Flashcard</button>
        ) : (
          <button onClick={handleAdd}>Add Flashcard</button>
        )}
      </div>
      <div>
        <h3>Flashcards List</h3>
        <ul>
          {flashcards.map((card, index) => (
            <li key={card.id}>
              <p>{card.question} - {card.answer}</p>
              <button onClick={() => handleEdit(index)}>Edit</button>
              <button onClick={() => handleDelete(card.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
