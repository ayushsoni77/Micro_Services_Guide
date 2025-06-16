import React from 'react';
import TaskItem from './TaskItem';

interface TaskListProps {
  phaseId: number;
  tasks: string[];
}

const TaskList: React.FC<TaskListProps> = ({ phaseId, tasks }) => {
  return (
    <div className="task-list">
      <h3>Tasks Checklist</h3>
      {tasks.map((task, index) => (
        <TaskItem
          key={`task-${phaseId}-${index + 1}`}
          taskId={`task-${phaseId}-${index + 1}`}
          label={task}
        />
      ))}
    </div>
  );
};

export default TaskList;