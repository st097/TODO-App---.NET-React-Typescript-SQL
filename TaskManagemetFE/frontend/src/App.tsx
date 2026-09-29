import {useEffect, useState} from "react";
import axios from "axios";

import {taskApi} from "./api/taskApi";
import TaskForm from "./components/TaskForm";
import TaskCard from "./components/TaskCard";
import TaskStats from "./components/TaskStatus";


import type {
  TaskItem,
  TaskInput,
  TaskStatus
} from "./types/task";

import "./App.css";


function App(){
const [tasks, setTasks] = useState<TaskItem[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [showForm, setShowForm] = useState(false);

const [editingTask, setEditingTask]= useState<TaskItem | null>(null);
const [search, setSearch]= useState("");
const [statusFilter, setStatusFilter] = useState<TaskStatus | "All">("All");

async function loadTasks(){
  try{
    setError("");
    const data = await taskApi.getAll();
    setTasks(data);
  }catch{
    setError("Could not load tasks. Check your API.");
  }finally{
    setLoading(false);
  }
}

useEffect(()=>{
  void loadTasks();
},[]);

async function handleSave(data: TaskInput){
try{
  setError("");
  if(editingTask){
   await taskApi.update(editingTask.id,data);
  }else{
   await taskApi.create(data);
  }

  setEditingTask(null);
  setShowForm(false);

  await loadTasks();
}catch(err){
  const message = axios.isAxiosError(err) ? err.response?.data?.title || 
                                            err.response?.data?.message ||
                                            err.message:"An unexpected error occurred.";
  setError(String(message));

  throw err;
}
}

async function handleDelete(id:number){
  const confirmed = window.confirm(
    "Are you sure you want to delete this task?"
  );
  if(!confirmed){
    return;
  }
try{
setError("")
await taskApi.remove(id);
await loadTasks();
}catch{
  setError("Could not delete the task.");
}
}

const filteredTasks = tasks.filter(task =>{
  const matchesSearch =
    task.title.toLowerCase().includes(search.toLowerCase()
  ) || (task.description ?? "").toLowerCase().includes(
    search.toLowerCase()
  );

  const matchesStatus = statusFilter === "All" || task.status === statusFilter;

  return matchesSearch && matchesStatus;
});

return(
  <main className="app-container">
    <header className="app-header">
      <div>
        <h1>Task Manager</h1>
        <p>Organize your work and track progress.</p>
      </div>
      <button
      onClick={()=>{setEditingTask(null);
                   setShowForm(true);
      }}
      >
        + Add Task
      </button>
    </header>
    {error && (
      <div className="error-message" role="alert">
        {error}
        <button
        className="secondary-button"
        onClick={()=>setError("")}
        >
          Dismiss
        </button>
      </div>
    )}
    <TaskStats tasks={tasks}/>
    {showForm && (
      <TaskForm
      initialTask={editingTask}
      onSubmit={handleSave}
      onCancel={()=>{
        setShowForm(false);
        setEditingTask(null);
      }}
      />
    )}
    <section className="tasks-section">
     <div className="section-header">
      <h2>My tasks</h2>
      <span>{filteredTasks.length} tasks</span>
     </div>
     <div className="filters">
      <input 
      type="search"
      placeholder="Seaarch tasks..."
      aria-label="Search tasks"
      value={search}
      onChange={event =>
        setSearch(event.target.value)
      }
      />
      <select
      aria-label="Filter by status"
      value={statusFilter}
      onChange={event =>
        setStatusFilter(
          event.target.value as TaskStatus | "All"
        )
      }
      >
        <option value="All">All statuses</option>
        <option value="Pending">Pending</option>
        <option value="AInProgress">In progress</option>
        <option value="Completed">Completed</option>
      </select>
     </div>

     {loading ? (
      <p>Loading tasks...</p>
     ) : filteredTasks.length === 0 ? (
      <p className="empty-message">No tasks found.</p>
     ) : (
      <div className="task-list">
        {filteredTasks.map(task =>(
          <TaskCard
          key={task.id}
          task={task}
          onEdit={selectedTask => {
            setEditingTask(selectedTask);
            setShowForm(true);
            window.scrollTo({
              top:0,
              behavior:"smooth"
            });
          }}
          onDelete={handleDelete}
          />
        ))}
      </div>
     )
    }
     
    </section>

  </main>
)

}

export default App;