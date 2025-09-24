-- V1__init.sql
CREATE TABLE IF NOT EXISTS tasks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    text VARCHAR(100) NOT NULL,
    done BOOLEAN NOT NULL,
    created_at TIMESTAMP(6) NOT NULL,
    updated_at TIMESTAMP(6) NOT NULL
);

-- 可选索引（按你的查询习惯）
CREATE INDEX IF NOT EXISTS idx_tasks_done ON tasks(done);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
