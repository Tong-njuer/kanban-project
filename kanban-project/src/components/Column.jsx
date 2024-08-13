import React from "react";
import AddTaskButton from "./AddTaskButton";
import Task from "./Task";
import { Droppable, Draggable } from "react-beautiful-dnd";
import uuid from "react-uuid";

const Column = ({ tag, currentEvent, events, setEvents }) => {
  const handleAdd = () => {
    const name = prompt("输入任务名");
    const details = prompt("输入任务评论");
    if (!(name && details)) return;
    setEvents((prev) => {
      const arrCopy = [...prev];
      const index = prev.findIndex(
        (event) => event.title === currentEvent.title
      );
      const eventCopy = arrCopy[index];
      arrCopy.splice(index, 1, {
        ...eventCopy,
        [tag]: [
          ...eventCopy[tag],
          { name: name, id: uuid(), details: details, file: null }, // Added file: null
        ],
      });
      return arrCopy;
    });
  };
  const handleRemove = (id, e) => {
    e.stopPropagation();
    setEvents((prev) =>
      prev.map((event) => {
        if (event.title === currentEvent.title) {
          const taskList = event[tag];
          const index = taskList.findIndex((item) => item.id === id);
          taskList.splice(index, 1);
          return { ...event, [tag]: [...taskList] };
        } else {
          return event;
        }
      })
    );
  };
  const handleUpdate = (id, updates) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.title === currentEvent.title) {
          const taskList = event[tag];
          const index = taskList.findIndex((item) => item.id === id);
          const updatedTask = {
            ...taskList[index],
            ...updates,
          };
          taskList.splice(index, 1);
          return { ...event, [tag]: [...taskList, updatedTask] };
        } else {
          return event;
        }
      })
    );
  };

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (source.droppableId !== destination.droppableId) {
      const startColumn = events.find(
        (event) => event.title === currentEvent.title
      );
      const finishColumn = events.find(
        (event) => event.title === destination.droppableId
      );

      const task = startColumn[tag].find((task) => task.id === draggableId);

      setEvents((prev) => {
        const startTaskList = startColumn[tag].filter(
          (task) => task.id !== draggableId
        );
        const finishTaskList = [...finishColumn[tag], task];

        return prev.map((event) => {
          if (event.title === startColumn.title) {
            return { ...event, [tag]: startTaskList };
          }
          if (event.title === finishColumn.title) {
            return { ...event, [destination.droppableId]: finishTaskList };
          }
          return event;
        });
      });
    }
  };

  return (
    <div className="column">
      {tag}
      <AddTaskButton handleClick={handleAdd} />
      <Droppable droppableId={tag} type="TASK">
        {(provided) => (
          <div
            className="task-container"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {events
              .find((event) => event.title === currentEvent.title)
              ?.[tag].map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <Task
                      name={item.name}
                      details={item.details}
                      id={item.id}
                      file={item.file}
                      provided={provided}
                      handleRemove={handleRemove}
                      handleUpdate={handleUpdate}
                    />
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
