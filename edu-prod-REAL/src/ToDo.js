import React, { useState, useEffect } from 'react';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f7f7f7',
    color: '#000',
    padding: '20px',
    boxSizing: 'border-box',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  todoItem: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '15px',
    marginBottom: '10px',
    width: '100%',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  todoTitle: {
    fontSize: '1.5rem',
    marginBottom: '10px',
  },
  todoPriority: {
    fontSize: '1rem',
    marginBottom: '10px',
    color: '#777',
  },
  todoState: {
    fontSize: '1rem',
    color: '#777',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    width: '300px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  select: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
};

const ToDo = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/todos', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setTodos(data);
  };

  const handleAddToDo = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/todos', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, priority }),
    });
    const newToDo = await response.json();
    setTodos([...todos, newToDo]);
    setModalOpen(false);
    setTitle('');
    setPriority(1);
  };

  const handleUpdateState = async (id, state) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/todos/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ state }),
    });
    const updatedToDo = await response.json();
    setTodos(todos.map(todo => (todo._id === id ? updatedToDo : todo)));
  };

  return (
    <div style={styles.container}>
      <h1>To Do List</h1>
      <button style={styles.button} onClick={() => setModalOpen(true)}>Add To Do Item</button>
      {todos.map(todo => (
        <div key={todo._id} style={styles.todoItem}>
          <h3 style={styles.todoTitle}>{todo.title}</h3>
          <p style={styles.todoPriority}>Priority: {todo.priority}</p>
          <p style={styles.todoState}>
            State:
            <select
              style={styles.select}
              value={todo.state}
              onChange={(e) => handleUpdateState(todo._id, e.target.value)}
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Blocked">Blocked</option>
              <option value="Canceled">Canceled</option>
            </select>
          </p>
        </div>
      ))}
      {modalOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2>Add To Do Item</h2>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
              required
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={styles.select}
              required
            >
              <option value="1">P1</option>
              <option value="2">P2</option>
              <option value="3">P3</option>
              <option value="4">P4</option>
              <option value="5">P5</option>
            </select>
            <button style={styles.button} onClick={handleAddToDo}>Add</button>
            <button style={styles.button} onClick={() => setModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToDo;
