import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from './ThemeContext';
import Counter from './Counter';
import LoginForm from './LoginForm';
import TaskList from './TaskList';
import TaskDetail from './TaskDetail';

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    try{
    return savedTodos ? JSON.parse(savedTodos) : [];
    }catch (e) {
      console.error("Error parsing save todos:", e);
      return [];
    }
  });
  const [input, setInput] = useState('');

  useEffect(() => {
    if (Array.isArray(todos)) {
    localStorage.setItem('todos', JSON.stringify(todos));
    }else {
      console.error("Todos is not an array:", todos);
    }
  }, [todos]);

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { text: input, isCompleted: false }]);
      setInput('');
    }
  };

  const toggleComplete = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].isCompleted = !updatedTodos[index].isCompleted;
    setTodos(updatedTodos);
  };

  const deleteTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  ;}

  return (
    <Router>
    <ThemeProvider>
    <div className='App'>
        <div>
          <nav>
            <Link to='/'>任务清单</Link>
          </nav>
          <Routes>
            <Route path='/' element={<TaskList />} />
            <Route path='/task/:id' element={<TaskDetail />}/>
          </Routes>

          <Counter />
          <LoginForm />
        </div>
    </div>
    </ThemeProvider>
    </Router>
  );
}

export default App;
