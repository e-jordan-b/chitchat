import React, { useState, useEffect, useRef } from 'react';
import ReactQuill, { ReactQuillProps } from 'react-quill';
import { Summary } from '../../models/summary-model';
import 'react-quill/dist/quill.snow.css';

import './room-summary.css';
import useClickOutside from '../../hooks/use-clickoutside';

const RoomSummary: React.FC<{
  summary: Summary;
  isEditing: boolean;
  isLocked: boolean;
  onEdit: () => void;
}> = ({ summary, onEdit, isEditing, isLocked }) => {
  const summaryRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<ReactQuill>(null);
  // const [text, setText] = useState(summary.text);
  const [isEditorClicked, setIsEditorClicked] = useState(false);
  const [text, setText] = useState<string>(summary.text);
  // console.log(text)
  // useClickOutside(summaryRef, () => {

  //   console.log('CLICKED OUtsiDe');
  //   if (isEditing) {
  //     console.log('END EDITING for', summary._id);
  //     onEditEnd();
  //     setIsEditing(false);
  //   }
  // });

  const handleClick = () => {
    setIsEditorClicked(true);

    if (!isEditorClicked) {
      onEdit();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        summaryRef.current &&
        !summaryRef.current.contains(event.target as Node) &&
        isEditing
      ) {
        onEdit();
        setIsEditorClicked(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      // setIsEditorClicked(false)
    };
  }, [isEditing, onEdit]);

  const handleSubmit = () => {
    const modifiedText = editorRef.current?.getEditor().root.innerHTML;

    console.log(modifiedText);
  };

  return (
    <div className="roomsummary">
      <div
        className="roomsummary__summary"
        onClick={handleClick}
        ref={summaryRef}
      >
        {isEditing ? (
          <>
            <div className="flex items-center">
              <button className="bg-yellow" onClick={handleSubmit}>
                save
              </button>
              <ReactQuill
                value={summary.text}
                // onChange={handleChange}
                ref={editorRef}
              />
            </div>
          </>
        ) : (
          <div>
            {/* <div dangerouslySetInnerHTML={{ __html: summary.text}} /> */}
            {summary.text}
          </div>
        )}
      </div>
      <div className="roomsummary__timeindicator">11:20 AM</div>
    </div>
  );
};

export default RoomSummary;
