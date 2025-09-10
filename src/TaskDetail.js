import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { ThemeContext } from "./ThemeContext";

function TaskDetail() {
    const { id } = useParams();
    const { theme } = useContext(ThemeContext);

    return (
        <div style={{ background: theme === 'light' ? '#fff' : '#333', color: theme === 'light' ? '#000' : '#fff' }}>
            <h2>任务详情</h2>
            <p>任务ID:{id},当前主题是{theme}</p>
        </div>
    );
}

export default TaskDetail;