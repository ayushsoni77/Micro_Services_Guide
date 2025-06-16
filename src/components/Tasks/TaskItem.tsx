import React from 'react';
import { useApp } from '../../context/AppContext';

interface TaskItemProps {
  taskId: string;
  label: string;
}

const TaskItem: React.FC<TaskItemProps> = ({ taskId, label }) => {
  const { state, dispatch } = useApp();
  const isCompleted = state.completedTasks.has(taskId);

  const handleToggle = () => {
    dispatch({ type: 'TOGGLE_TASK', payload: taskId });
  };

  return (
    <div className={`task-item ${isCompleted ? 'completed' : ''}`}>
      <input
        type="checkbox"
        id={taskId}
        className="task-checkbox"
        checked={isCompleted}
        onChange={handleToggle}
      />
      <label htmlFor={taskId}>{label}</label>
    </div>
  );
};

export default TaskItem;