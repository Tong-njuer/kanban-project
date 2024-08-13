import React, { useCallback } from "react";
import Column from "./Column";
import { DragDropContext } from "react-beautiful-dnd";

const TaskBox = ({ events, setEvents, currentEvent, setCurrentEvent }) => {
  const handleRemove = useCallback(() => {
    if (confirm("确认删除？")) {
      setEvents((prev) => {
        const result = prev.filter((item) => item.title != currentEvent.title);
        if (!result.length) {
          const initEvent = [
            {
              title: "空白看板",
              ["To do"]: [],
              ["In progress"]: [],
              ["Completed"]: [],
            },
          ];
          setEvents(initEvent);
        } else {
          setCurrentEvent(result[0]);
        }
        return result;
      });
    }
  }, [events, setEvents, currentEvent, setCurrentEvent]);

  const handleDragEnd = useCallback(
    (result) => {
      if (!result.destination) return;
      const { source, destination } = result;
      const curEvent = events.find((item) => item.title === currentEvent.title);
      const taskCopy = curEvent[source.droppableId][source.index];
      setEvents((prev) =>
        prev.map((event) => {
          if (event.title === currentEvent.title) {
            let eventCopy = { ...event };
            const taskListSource = event[source.droppableId];
            taskListSource.splice(source.index, 1);
            eventCopy = { ...event, [source.droppableId]: taskListSource };
            const taskListDes = event[destination.droppableId];
            taskListDes.splice(destination.index, 0, taskCopy);
            eventCopy = { ...event, [destination.droppableId]: taskListDes };
            return eventCopy;
          } else {
            return event;
          }
        })
      );
    },
    [events, setEvents, currentEvent]
  );

  return (
    <div className="task-box">
      <header className="task-box-header">
        <h1 className="task-box-title">当前任务界面</h1>
        <button className="remove-button" onClick={handleRemove}>
          删除当前看板
        </button>
      </header>
      <DragDropContext onDragEnd={(result) => handleDragEnd(result)}>
        <div className="task-box-body">
          {["To do", "In progress", "Completed"].map((tag) => (
            <Column
              key={tag}
              tag={tag}
              events={events}
              setEvents={setEvents}
              currentEvent={currentEvent}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskBox;
