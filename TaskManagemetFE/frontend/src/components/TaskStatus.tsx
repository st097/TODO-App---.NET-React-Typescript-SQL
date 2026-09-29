import type {TaskItem} from "../types/task";

interface TaskStatsProps{
    tasks: TaskItem[];
}

export default function TaskStats({
    tasks}: TaskStatsProps){
    const total = tasks.length;

    const pending = tasks.filter(
        task => task.status === "Pending").length;
        const inProgress = tasks.filter(
    task => task.status === "InProgress"
  ).length;
    
    const completed = tasks.filter(
        task => task.status === "Completed").length;
    
    return (
        <section className ="stat-grid">
            <div className="stat-card">
                <span>Total tasks</span>
                <strong>{total}</strong>
            </div>
            <div className="stat-card">
                <span>Pending</span>
                <strong>{pending}</strong>
            </div>
            <div className="stat-card">
                <span>In progress</span>
                <strong>{inProgress}</strong>
            </div>
            <div className="stat-card">
                <span>Completed</span>
                <strong>{completed}</strong>
            </div>
        </section>
    )


    }
