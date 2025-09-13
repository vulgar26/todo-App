// src/utils/mapTask.js
/**
 * 把后端实体 {id,title,completed,...}
 * 映射为前端 Task {id,text,done,...}
 */
export function mapServerTaskToClient(row) {
  if (!row || typeof row !== 'object') return null;
  return {
    id: row.id,
    text: row.title,
    done: !!row.completed,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
