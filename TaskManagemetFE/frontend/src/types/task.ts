export type TaskStatus =
|"Pending"
|"InProgress"
|"Completed";

export type TaskPriority =
|"Low"
|"Medium"
|"High";

export interface TaskItem 
{
  id: number;
  title: string;
  description: string | null; 
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  createdAt: string;
}

export interface TaskInput
{
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
}