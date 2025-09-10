import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "./ThemeContext";

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [input, setInput] = useState('');
    const { theme, toggleTheme } = useContext(ThemeContext);

    const addTask = () => {
        if (input.trim()) {
            setTasks([...tasks, input]);
            setInput('');
        }
    };

    const deleteTask = (index) => {
        setTasks(tasks.filter((_, i) => i !== index));
    };

    return (
        <div style={{background: theme === 'light' ? '#fff' : '#333', color: theme === 'light' ? '#000' : '#fff'}}>
            <h2>任务清单</h2>
            <button onClick={toggleTheme}>切换主题</button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入任务"
            />
            <button onClick={addTask}>添加任务</button>

            {tasks.length === 0 ?(
                <p>没有任务</p>
            ) : (
                <ul>
                    {tasks.map((task, index) => (
                        <li key={index}>
                            {task}
                            <Link to={`/task/${index}`}>{task}</Link>
                            <button onClick={() => deleteTask(index)}>删除</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TaskList;