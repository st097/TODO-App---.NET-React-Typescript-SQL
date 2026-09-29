import { describe, expect, it } from "vitest";
import type { TaskItem } from "../types/task";
import TaskStats from "./TaskStatus";
import {render, screen} from "@testing-library/react";



describe("TaskStats",()=>{
    it("display the correct task counts", ()=>{
        const tasks: TaskItem[] =[
            {
                id:1,
                title:"First task",
                description: null,
                status:"Pending",
                priority:"Low",
                dueDate:null,
                createdAt:"2026-09-28T10:00:00Z"
            },
            {
              id:2,
              title:"Second task",
              description:null,
              status:"Completed",
              priority:"High",
              dueDate:null,
              createdAt: "2026-09-28T11:00:00Z"
            }
        ];

       render(<TaskStats tasks={tasks}/>);

       expect(
        screen.getByText("Total tasks")
       ).toBeInTheDocument();

       expect(screen.getByText("Completed")).toBeInTheDocument();
       
       expect(screen.getByText("2")).toBeInTheDocument();

    })
})