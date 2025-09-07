import React, {useState, useEffect} from 'react';
import './App.css';

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
    <div className='App'>
      <h1>待办事项</h1>
      <input
        type='text'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='输入待办事项'
      />
      <button onClick={addTodo}>添加</button>

      <ul>
        {todos.map((todo, index)=>(
          <li
            key={index}
            style={{
              textDecoration: todo.isCompleted ? 'line-through' : 'none',
            }}
          >
            {todo.text}
            <button onClick={() => toggleComplete(index)}>
              {todo.isCompleted ? '未完成' : '完成'}
            </button>
            <button onClick={() => deleteTodo(index)}>删除</button>
          </li>  
        ))}
      </ul>
    </div>
  );
}

export default App;
