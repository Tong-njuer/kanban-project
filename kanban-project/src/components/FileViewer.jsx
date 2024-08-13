import React from "react";

const FileViewer = ({ file }) => {
  if (!file) return null;

  const fileUrl = URL.createObjectURL(file);

  return (
    <div className="file-viewer">
      <p>Uploaded: {file.name}</p>
      <a href={fileUrl} target="_blank" rel="noopener noreferrer">
        预览附件
      </a>
    </div>
  );
};

export default FileViewer;
