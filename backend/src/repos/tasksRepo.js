// backend/src/repos/tasksRepo.js
import { db } from '../db/connection.js';

/**
 * 列出任务
 */
export function listTasks({ userId, offset = 0, limit = 20, done, sort = 'id', order = 'DESC' }) {
  try {
    let sql = 'SELECT * FROM tasks WHERE userId = ?';
    const params = [userId];

    // 添加完成状态过滤
    if (typeof done === 'boolean') {
      sql += ' AND completed = ?';
      params.push(done ? 1 : 0);
    }

    // 添加排序
    const validSortColumns = ['id', 'title', 'completed', 'createdAt', 'updatedAt'];
    const validOrders = ['ASC', 'DESC'];
    
    if (validSortColumns.includes(sort) && validOrders.includes(order.toUpperCase())) {
      sql += ` ORDER BY ${sort} ${order.toUpperCase()}`;
    } else {
      sql += ' ORDER BY id DESC'; // 默认排序
    }

    // 添加分页
    sql += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    console.log('Executing SQL:', sql, 'with params:', params);
    const result = db.prepare(sql).all(...params);
    console.log('Found tasks:', result.length);
    
    return result;
  } catch (error) {
    console.error('Error in listTasks:', error);
    throw error;
  }
}

/**
 * 根据ID获取单个任务
 */
export function getById({ userId, id }) {
  try {
    const sql = 'SELECT * FROM tasks WHERE userId = ? AND id = ?';
    console.log('Executing getById SQL:', sql, 'with params:', [userId, id]);
    
    const result = db.prepare(sql).get(userId, id);
    console.log('getById result:', result);
    
    return result;
  } catch (error) {
    console.error('Error in getById:', error);
    throw error;
  }
}

/**
 * 创建任务
 */
export function createTask({ userId, text }) {
  try {
    const sql = `
      INSERT INTO tasks (userId, title, completed, createdAt, updatedAt) 
      VALUES (?, ?, 0, datetime('now'), datetime('now'))
    `;
    
    console.log('Executing createTask SQL:', sql, 'with params:', [userId, text]);
    
    const stmt = db.prepare(sql);
    const result = stmt.run(userId, text);
    
    console.log('Insert result:', result);
    
    // 返回新创建的任务
    const newTask = getById({ userId, id: result.lastInsertRowid });
    console.log('Created task:', newTask);
    
    return newTask;
  } catch (error) {
    console.error('Error in createTask:', error);
    throw error;
  }
}

/**
 * 切换任务完成状态
 */
export function toggleTask({ userId, id, done }) {
  try {
    const sql = `
      UPDATE tasks 
      SET completed = ?, updatedAt = datetime('now') 
      WHERE userId = ? AND id = ?
    `;
    
    console.log('Executing toggleTask SQL:', sql, 'with params:', [done ? 1 : 0, userId, id]);
    
    const stmt = db.prepare(sql);
    const result = stmt.run(done ? 1 : 0, userId, id);
    
    console.log('Update result:', result);
    
    if (result.changes === 0) {
      console.log('No rows updated - task not found');
      return null;
    }
    
    // 返回更新后的任务
    const updatedTask = getById({ userId, id });
    console.log('Updated task:', updatedTask);
    
    return updatedTask;
  } catch (error) {
    console.error('Error in toggleTask:', error);
    throw error;
  }
}

/**
 * 删除任务
 */
export function deleteTask({ userId, id }) {
  try {
    const sql = 'DELETE FROM tasks WHERE userId = ? AND id = ?';
    console.log('Executing deleteTask SQL:', sql, 'with params:', [userId, id]);
    
    const stmt = db.prepare(sql);
    const result = stmt.run(userId, id);
    
    console.log('Delete result:', result);
    
    return result.changes > 0;
  } catch (error) {
    console.error('Error in deleteTask:', error);
    throw error;
  }
}

// 调试：检查所有导出
console.log('tasksRepo exports:', {
  listTasks: typeof listTasks,
  getById: typeof getById,
  createTask: typeof createTask,
  toggleTask: typeof toggleTask,
  deleteTask: typeof deleteTask
});