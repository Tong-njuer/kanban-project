import React, { useState } from "react";
import FileViewer from "./FileViewer";

const Task = ({
  name,
  details,
  id,
  provided,
  handleUpdate,
  handleRemove,
  file,
}) => {
  const [localFile, setLocalFile] = useState(file);
  const [showDetails, setShowDetails] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setLocalFile(selectedFile);
    handleUpdate(id, { file: selectedFile });
  };

  const handleFileRemove = () => {
    setLocalFile(null);
    handleUpdate(id, { file: null });
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    if (window.confirm("确认删除？")) {
      handleRemove(id, e);
    }
  };

  const updateTaskDetail = (field) => {
    const newDetail = prompt(`Enter new ${field}`);
    if (newDetail) {
      handleUpdate(id, { [field]: newDetail });
    }
  };

  return (
    <div
      className="task"
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <div className="task-header" onClick={() => setShowDetails(!showDetails)}>
        <h2 className="task-name">{name}</h2>
        <button
          class="button-5"
          role="button"
          onClick={() => updateTaskDetail("name")}
        >
          编辑任务名
        </button>
        <button
          class="button-5"
          role="button"
          onClick={() => updateTaskDetail("details")}
        >
          编辑任务评论
        </button>
      </div>

      {showDetails && (
        <div className="task-details">
          <p>{details}</p>
          <input type="file" id="file-uploader" onChange={handleFileChange} />
          {localFile && (
            <div className="file-info">
              <FileViewer file={localFile} />
              <button class="button-5" role="button" onClick={handleFileRemove}>
                删除附件
              </button>
            </div>
          )}
          <button class="button-5" role="button" onClick={handleRemoveClick}>
            删除任务
          </button>
        </div>
      )}
    </div>
  );
};

export default Task;
