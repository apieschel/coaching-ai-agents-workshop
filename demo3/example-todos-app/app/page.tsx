"use client";

import { TasksList } from "@/components/TasksList";
import { TasksProvider } from "@/lib/hooks/use-tasks";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css"; 
import { CopilotKitCSSProperties, CopilotPopup, CopilotSidebar } from "@copilotkit/react-ui";

export default function Home() {
  return (
    <>
      <TasksProvider>
        <TasksList />
      </TasksProvider>
      <div
        style={
          {
            height: `100vh`,
            "--copilot-kit-primary-color": "red",
          } as CopilotKitCSSProperties
        }
      >
        <CopilotSidebar
          labels={{
            title: "To Do Assistant",
            initial: "Hi! 👋 How can I assist with your list?",
          }}
        />
      </div>
    </>
  );
}
