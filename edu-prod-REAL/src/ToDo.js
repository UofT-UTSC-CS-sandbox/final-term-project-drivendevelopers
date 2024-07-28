import React, { useState, useEffect, useCallback } from 'react';

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
  filterSelect: {
    width: '200px',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  sortSelect: {
    width: '200px',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  deleteButton: {
    padding: '5px 10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#dc3545',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    marginLeft: '10px',
  },
};

const ToDo = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState(1);
  const [stateFilter, setStateFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const fetchTodos = useCallback(async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/todos${stateFilter ? `?state=${stateFilter}` : ''}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setTodos(data);
  }, [stateFilter]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

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

  const handleDeleteToDo = async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/todos/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      setTodos(todos.filter(todo => todo._id !== id));
    } else {
      console.error('Failed to delete to-do item');
    }
  };

  const sortedTodos = todos.slice().sort((a, b) => {
    if (sortOrder === 'highest') {
      return a.priority - b.priority;
    }
    if (sortOrder === 'lowest') {
      return b.priority - a.priority;
    }
    return 0;
  });

  return (
    <div style={styles.container}>
      <h1>To Do List</h1>
      <select
        style={styles.filterSelect}
        value={stateFilter}
        onChange={(e) => setStateFilter(e.target.value)}
      >
        <option value="">All</option>
        <option value="Not Started">Not Started</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
        <option value="Blocked">Blocked</option>
        <option value="Canceled">Canceled</option>
      </select>
      <select
        style={styles.sortSelect}
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
      >
        <option value="">Sort by Priority</option>
        <option value="highest">Highest to Lowest</option>
        <option value="lowest">Lowest to Highest</option>
      </select>
      <button style={styles.button} onClick={() => setModalOpen(true)}>Add To Do Item</button>
      {sortedTodos.map(todo => (
        <div key={todo._id} style={styles.todoItem}>
          <h3 style={styles.todoTitle}>{todo.title}</h3>
          <p style={styles.todoPriority}>Priority: P{todo.priority}</p>
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
          <button style={styles.deleteButton} onClick={() => handleDeleteToDo(todo._id)}>Delete</button>
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
              onChange={(e) => setPriority(parseInt(e.target.value))}
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
