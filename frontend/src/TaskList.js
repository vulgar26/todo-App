import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "./ThemeContext";

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [input, setInput] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { theme, toggleTheme } = useContext(ThemeContext);

    // 添加任务
    async function addTask() {
        const text = input.trim();
        if (!text) return;
        
        console.log('📝 准备添加任务:', text);
        
        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            
            console.log('📡 添加任务响应状态:', res.status);
            
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${res.status}`);
            }
            
            const result = await res.json();
            console.log('✅ 任务添加成功:', result);
            
            const created = result.data;
            setTasks(prev => [created, ...prev]);
            setInput('');
            setError(null);
        } catch (e) {
            console.error('❌ 添加任务失败:', e);
            setError(`添加失败：${e.message}`);
        }
    }

    // 删除任务
    async function deleteTask(id) {
        try {
            const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
            if (res.status !== 204) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${res.status}`);
            }
            setTasks(prev => prev.filter(t => t.id !== id));
            setError(null);
        } catch (e) {
            setError(`删除失败：${e.message}`);
        }
    }

    // 加载任务
    useEffect(() => {
        console.log('🔄 TaskList组件已挂载，开始加载任务...');
        
        async function loadTasks() {
            try {
                console.log('📡 发送请求: GET /api/tasks');
                const res = await fetch('/api/tasks');
                console.log('📡 响应状态:', res.status, res.statusText);
                
                if (!res.ok) {
                    const text = await res.text().catch(() => '');
                    throw new Error(`HTTP ${res.status} ${res.statusText}`);
                }
                
                const result = await res.json();
                console.log('📋 接收到的数据:', result);
                
                const taskList = result.data || [];
                console.log('📋 解析出的任务列表:', taskList);
                setTasks(taskList);
                
            } catch (e) {
                console.error('❌ 加载任务失败:', e);
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        
        loadTasks();
    }, []);

    // 如果正在加载
    if (loading) {
        return (
            <div style={{ padding: '20px' }}>
                <h2>任务清单</h2>
                <p>加载中...</p>
            </div>
        );
    }

    return (
        <div style={{
            background: theme === 'light' ? '#fff' : '#333', 
            color: theme === 'light' ? '#000' : '#fff',
            padding: '20px'
        }}>
            <h2>任务清单</h2>
            
            <button onClick={toggleTheme} style={{ marginBottom: '15px' }}>
                切换主题 ({theme === 'light' ? '浅色' : '深色'})
            </button>
            
            {/* 调试信息 */}
            <div style={{ 
                background: '#f0f0f0', 
                color: '#000',
                padding: '10px', 
                marginBottom: '15px',
                borderRadius: '4px',
                fontSize: '12px'
            }}>
                <strong>调试信息：</strong> 
                加载={loading ? '是' : '否'}, 
                错误={error || '无'}, 
                任务数量={tasks.length}
                <br/>
                <small>如果看到这个信息说明React组件正常工作</small>
            </div>
            
            {error && (
                <div style={{ 
                    color: '#d32f2f', 
                    background: '#ffebee', 
                    padding: '10px', 
                    borderRadius: '4px',
                    marginBottom: '15px'
                }}>
                    ❌ 出错了：{error}
                    <button 
                        onClick={() => setError(null)} 
                        style={{ marginLeft: '10px' }}
                    >
                        清除错误
                    </button>
                </div>
            )}
            
            {/* 添加任务表单 */}
            <div style={{ margin: '15px 0' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                    placeholder="输入任务内容..."
                    style={{ 
                        marginRight: '10px', 
                        padding: '8px 12px',
                        width: '300px'
                    }}
                />
                <button onClick={addTask}>
                    添加任务
                </button>
            </div>

            {/* 任务列表 */}
            <div>
                <h3>任务列表 (共 {tasks.length} 个)</h3>
                
                {tasks.length === 0 ? (
                    <p style={{ color: '#666' }}>
                        暂无任务。尝试添加一个任务吧！
                    </p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {tasks.map((task) => (
                            <li 
                                key={task.id}
                                style={{ 
                                    border: '1px solid #ccc',
                                    margin: '5px 0',
                                    padding: '10px',
                                    borderRadius: '4px'
                                }}
                            >
                                <span style={{ marginRight: '10px' }}>
                                    #{task.id} {task.text}
                                </span>
                                
                                <Link 
                                    to={`/task/${task.id}`} 
                                    style={{ marginRight: '10px' }}
                                >
                                    详情
                                </Link>
                                
                                <button 
                                    onClick={() => deleteTask(task.id)}
                                    style={{ 
                                        background: '#f44336',
                                        color: 'white',
                                        border: 'none',
                                        padding: '2px 6px'
                                    }}
                                >
                                    删除
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default TaskList;