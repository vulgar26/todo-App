import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "./ThemeContext";

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [input, setInput] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { theme, toggleTheme } = useContext(ThemeContext);

    const addTask = () => {
        if (input.trim()) {
            const newTask = { id: Date.now(), text: input, done: false };

            setTasks([...tasks, newTask]);
            setInput('');

            fetch('http://localhost:3000/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(newTask),
            })
            .then(response => response.json())
            .then(data => {
                console.log('任务添加成功：', data);
            })
            .catch((error) => {
                console.error('添加任务失败', error);
                setError('无法将任务添加到后端');
            })
        }
    };

    const deleteTask = (index) => {
        const taskToDelete = tasks[index];

        fetch(`http://localhost:3000/api/tasks/${taskToDelete.id}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            console.log('任务已经删除', data);
            setTasks(tasks.filter((_, i) => i !== index));
        })
        .catch((error) => {
            console.error('删除任务失败:', error);
            setError('无法从后端删除任务');
        });
    };

    useEffect(() => {
        fetch('http://localhost:3000/api/tasks')
        .then((response) => {
            if (!response.ok) {
                throw new Error('网络错误');
            }
            return response.json();
        })
        .then((data) => {
            setTasks(data);
            setLoading(false);
        })
        .catch((error) => {
            console.error('请求失败', error);
            setError(error.message);
            setLoading(false);
        });
    }, []);

    if (loading) return <p>加载中...</p>;
    if (error) return <p style={{ color: 'red' }}>出错了：{error}</p>;

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
                        <li key={task.id}>
                            {task.text}
                            <Link to={`/task/${task.id}`}>{task.text}</Link>
                            <button onClick={() => deleteTask(index)}>删除</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TaskList;