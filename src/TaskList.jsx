import React, { useState } from "react";

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [input, setInput] = useState('');

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
        <div>
            <h2>任务清单</h2>
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
                            <button onClick={() => deleteTask(index)}>删除</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TaskList;