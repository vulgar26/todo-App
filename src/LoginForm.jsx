import React, { useState } from "react";

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`用户名：${username},密码：${password}`);
    };

    return (
        <div>
            <h2>登录表单</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>用户名：</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>密码：</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">提交</button>
            </form>
        </div>
    );
}

export default LoginForm;