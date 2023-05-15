import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import { Summary } from '../../models/summary-model';
import 'react-quill/dist/quill.snow.css';

import './room-summary.css';

const RoomSummary: React.FC<{ summary: Summary }> = ({ summary }) => {
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
  // const handleTextBlur = () => {
  //   setEditiogTextIndex(null)
  // };
  return (
    <div className="roomsummary">
      <div className="roomsummary__summary">asfasfasfasfas</div>
      <div className="roomsummary__timeindicator">11:20AM</div>
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
