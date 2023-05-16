import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import { Summary } from '../../models/summary-model';
import 'react-quill/dist/quill.snow.css';

import './room-summary.css';
import useClickOutside from '../../hooks/use-clickoutside';

const RoomSummary: React.FC<{
  summary: Summary;
  isEditing: boolean;
  isLocked: boolean;
  onEdit: (id: string) => void;
}> = ({ summary }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  // useClickOutside(summaryRef, () => {
  //   console.log('CLICKED OUtsiDe');
  //   if (isEditing) {
  //     console.log('END EDITING for', summary._id);
  //     onEditEnd();
  //     setIsEditing(false);
  //   }
  // });

  const startEditing = (id) => {
    if (!isEditing) {
      onEditStart(); // onEdit(id: string) => if id is currently stored it means that you were editing, and now you stopped

      setIsEditing(true);
    }
  };

  // const endEditing = () => {};

  // const [texts, setTexts] = useState<string[]>([]);
  // const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);
  // const [editingTextIndex, setEditiogTextIndex] = useState<number|null>(null)
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTexts((prevTexts) => [...prevTexts, `Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. It usually begins with:
  //     “Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.”`]);
  //     setCurrentTextIndex((prevIndex) => prevIndex + 1);
  //   }, 10000);
  //   return () => clearInterval(interval);
  // }, []);
  // const handleTextClick = (index: number) => {
  //   setEditiogTextIndex(index)
  // }
  // const handleTextChange = (value: string, index: number) => {
  //   setTexts((prevTexts) => {
  //     const updatedTexts = [...prevTexts];
  //     updatedTexts[index] = value;
  //     console.log(updatedTexts)
  //     return updatedTexts;
  //   });
  // };
  const handleTextBlur = () => {
    let id = '123'
    onEdit(id)
  };
  return (
    <div className="roomsummary">
      <div
        className="roomsummary__summary"
        onClick={startEditing}
        ref={summaryRef}
      >
        {summary.text}
      </div>

    <div className="roomsummary__timeindicator">11:20 AM</div>
      {/* {texts.map((text, index) => (
        <div key={index} onClick={() => handleTextClick(index)}>
          {editingTextIndex === index ? (
            <ReactQuill
              value={text}
              onChange={(value) => handleTextChange(value, index)}
              onBlur={handleTextBlur}
            />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: text }} />
          )}
        </div>
      ))} */}
    </div>
  );
};

export default RoomSummary;
