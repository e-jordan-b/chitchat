import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Summary } from '../../models/summary-model';
import RoomService from '../../services/room-service';
import './room-edit-summary.css';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import ArrowIcon from '../../assets/arrow-left.png';

const RoomEditSummary: React.FC<{
  summary: Summary;
  onClose: (summary: Summary) => void;
}> = ({ summary, onClose }) => {
  const [text, setText] = useState<string>(summary.text);
  const roomService = new RoomService();

  const onSave = async () => {
    const { summary: updatedSummary, error } = await roomService.updateSummary(
      summary._id,
      text
    );

    if (error) {
      console.log('RoomEditSummary/onSave error:', error);
      return;
    }

    if (updatedSummary) {
      onClose(updatedSummary);
    }
  };

  return (
    <div className="roomeditsummary">
      <div className="roomeditsummary__header">
        <button
          className="roomeditsummary__button"
          onClick={() => onClose(summary)}
          data-testid = 'close-button'
        >
          <img className="roomeditsummary__button__icon" src={ArrowIcon} />
        </button>
        <button className="roomeditsummary__button" onClick={onSave} data-testid = 'save-button'>
          Save
        </button>
      </div>

      <ReactQuill
        modules={{
          toolbar: [
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
          ],
        }}
        value={text}
        onChange={(value) => setText(value)}
        data-testid = 'quill-editor'
      />
    </div>
  );
};

export default RoomEditSummary;
