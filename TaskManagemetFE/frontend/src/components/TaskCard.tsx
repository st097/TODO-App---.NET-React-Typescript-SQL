import type {TaskItem} from "../types/task";

interface TaskCardProps{
    task: TaskItem;
    onEdit: (task: TaskItem) => void;
    onDelete:(id:number) => Promise<void>;
}

export default function TTaskCard({
    task,
    onEdit,
    onDelete
}: TaskCardProps){
    const formattedDate = task.dueDate ? task.dueDate.slice(0,10) : "No deadline";

    return(
        <article className="task-card">
            <div className="task-card-header">
                <h3>{task.title}</h3>

                <span className={`priority priority-${task.priority.toLocaleLowerCase()}`}
                >
                {task.priority}
                </span>
            </div>

        <p>{task.description || "No description"}</p>

        <div className="task-meta">
           <span className={`status status-${task.status}`}>
            {task.status === "InProgress" ? "In progress" : task.status}
           </span>
            <span>Due: {formattedDate}</span>
        </div>
        <div className="task-actions">
            <button
            className="secondary--button"
            onClick={()=> onEdit(task)}
            >
                Edit
            </button>
        <button 
         className="danger-button"
         onClick={()=> void onDelete(task.id)}
         >
            Delete
         </button>
        </div>
        </article>
    )
}
