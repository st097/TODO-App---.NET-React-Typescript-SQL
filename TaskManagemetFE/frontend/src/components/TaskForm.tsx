import {useEffect,useState} from 'react';
import type {FormEvent} from "react";
import type{TaskInput, TaskItem} from "../types/task";


interface TaskFormProps {
    initialTask?: TaskItem | null;
    onSubmit:(data: TaskInput) => Promise<void>;
    onCancel?:()=>void;
}

const emptyForm: TaskInput =
{
    title:"",
    description:"",
    status:"Pending",
    priority:"Medium",
    dueDate:null
};

export default function TaskForm({
    initialTask,
    onSubmit,
    onCancel
}: TaskFormProps) {
        const [form, setForm]= useState<TaskInput>(
            {...emptyForm}
        );

        const [saving, setSaving] =useState(false);

            useEffect(()=>{
                if(initialTask){
                    setForm({
                        title: initialTask.title,
                        description: initialTask.description ?? "",
                        status: initialTask.status,
                        priority: initialTask.priority,
                        dueDate: initialTask.dueDate ? initialTask.dueDate.slice(0,10) : null 
                    });
                    }else {
                        setForm({...emptyForm});
                    }
                },[initialTask]);

 function updateField<K extends keyof TaskInput>(
    field: K,
    value: TaskInput[K]
  ) {
    setForm(previous => ({
      ...previous,
      [field]: value
    }));
}

async function handleSubmit(event: FormEvent){
    event.preventDefault();

    if(!form.title.trim()){
        return;
    }

    setSaving(true);

    try{
        await onSubmit({
            ...form,
            title: form.title.trim(),
            dueDate: form.dueDate ? `${form.dueDate}T12:00:00Z` : null
        });

        if(!initialTask){
            setForm({...emptyForm});
        }
    } finally{
        setSaving(false);
    }
}

return (

    <form onSubmit ={handleSubmit} className ="task-form">
        <h2>
            {initialTask ? "Edit task" : "Create task"}
        </h2>

    <label htmlFor="title">Title</label>
    <input
    id="title"
    value={form.title}
    maxLength={150}
    minLength={3}
    required
    onChange={event=> updateField("title", event.target.value)}
    placeholder="Enter task title"
    />

    <label htmlFor="description">Description</label>
    <textarea
    id="description"
    value={form.description}
    maxLength={1000}
    onChange={event =>
        updateField("description", event.target.value)
    }
    placeholder="Task description"
    rows={3}
    />
    <label htmlFor="status">Status</label>
    <select
    id="status"
    value={form.status}
    onChange={event=>
        updateField(
            "status",
            event.target.value as TaskInput["status"]
        )
    }
    >
        <option value="Pending">Pending</option>
        <option value="InProgress">In progress</option>
        <option value="Completed">Completed</option>
    </select>

    <label htmlFor="priority">Priority</label>
    <select
    id="priority"
    value={form.priority}
    onChange={event =>
        updateField(
            "priority",
            event.target.value as TaskInput["priority"]
        )
    }
    >
       <option value="Low">Low</option> 
       <option value="Medium">Medium</option>
       <option value="High">High</option>
    </select>
    <label htmlFor="dueDate">Due Date</label>
    <input
    type="date"
    id="dueDate"
    value={form.dueDate ?? ""}
    onChange={event =>
        updateField("dueDate", event.target.value || null)
    }
    />
    <div className="form-actions">
        {onCancel && (
            <button
            type="button"
            className="secondary-button"
            onClick={onCancel}
            >
           Cancel  
    </button>
        )}

        <button type="submit" disabled={saving}>
            {
                saving ? "Saving..."
                :initialTask?"Save changes"
                : "Add task"}
        </button>
    </div>
    </form>
);

}





        
        
    

