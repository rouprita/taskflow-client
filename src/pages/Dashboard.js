import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'Todo', projectId: null, dueDate: null });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch { setError('Failed to load tasks'); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createTask(newTask);
      setNewTask({ title: '', description: '', status: 'Todo', projectId: null, dueDate: null });
      fetchTasks();
    } catch { setError('Failed to create task'); }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      await updateTask(task.id, { ...task, status: newStatus });
      fetchTasks();
    } catch { setError('Failed to update task'); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      fetchTasks();
    } catch { setError('Failed to delete task'); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const columns = ['Todo', 'InProgress', 'Done'];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>TaskFlow Dashboard</h1>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleCreate} style={styles.form}>
        <input
          style={styles.input}
          placeholder="Task title"
          value={newTask.title}
          onChange={(e) => setNewTask({...newTask, title: e.target.value})}
          required
        />
        <input
          style={styles.input}
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
        />
        <select
          style={styles.input}
          value={newTask.status}
          onChange={(e) => setNewTask({...newTask, status: e.target.value})}
        >
          <option value="Todo">Todo</option>
          <option value="InProgress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <button style={styles.addBtn} type="submit">+ Add Task</button>
      </form>

      <div style={styles.board}>
        {columns.map(col => (
          <div key={col} style={styles.column}>
            <h3 style={{
              ...styles.columnTitle,
              background: col === 'Todo' ? '#4361ee' : col === 'InProgress' ? '#f4a261' : '#2ecc71'
            }}>
              {col === 'InProgress' ? 'In Progress' : col}
              <span style={styles.badge}>{tasks.filter(t => t.status === col).length}</span>
            </h3>
            {tasks.filter(t => t.status === col).map(task => (
              <div key={task.id} style={styles.card}>
                <p style={styles.taskTitle}>{task.title}</p>
                <p style={styles.taskDesc}>{task.description}</p>
                <div style={styles.cardActions}>
                  {col !== 'Todo' && (
                    <button style={styles.moveBtn} onClick={() =>
                      handleStatusChange(task, col === 'InProgress' ? 'Todo' : 'InProgress')}>
                      ← Back
                    </button>
                  )}
                  {col !== 'Done' && (
                    <button style={styles.moveBtn} onClick={() =>
                      handleStatusChange(task, col === 'Todo' ? 'InProgress' : 'Done')}>
                      Next →
                    </button>
                  )}
                  <button style={styles.deleteBtn} onClick={() => handleDelete(task.id)}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight:'100vh', background:'#f0f2f5', padding:'20px' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' },
  headerTitle: { color:'#1a1a2e', margin:0 },
  logoutBtn: { padding:'8px 20px', background:'#e74c3c', color:'white', border:'none', borderRadius:'8px', cursor:'pointer' },
  error: { color:'red', textAlign:'center' },
  form: { display:'flex', gap:'10px', marginBottom:'24px', flexWrap:'wrap' },
  input: { padding:'10px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'14px', flex:1, minWidth:'150px' },
  addBtn: { padding:'10px 20px', background:'#4361ee', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'14px' },
  board: { display:'flex', gap:'20px', alignItems:'flex-start' },
  column: { flex:1, background:'white', borderRadius:'12px', overflow:'hidden', boxShadow:'0 2px 10px rgba(0,0,0,0.08)' },
  columnTitle: { color:'white', padding:'14px 16px', margin:0, display:'flex', justifyContent:'space-between', alignItems:'center' },
  badge: { background:'rgba(255,255,255,0.3)', borderRadius:'12px', padding:'2px 10px', fontSize:'13px' },
  card: { padding:'14px', borderBottom:'1px solid #f0f0f0' },
  taskTitle: { fontWeight:'bold', margin:'0 0 6px', color:'#1a1a2e' },
  taskDesc: { color:'#666', fontSize:'13px', margin:'0 0 10px' },
  cardActions: { display:'flex', gap:'8px' },
  moveBtn: { padding:'4px 10px', background:'#4361ee', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'12px' },
  deleteBtn: { padding:'4px 10px', background:'#e74c3c', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'12px', marginLeft:'auto' }
};

export default Dashboard;