import React from 'react';
import { Summary } from '../../models/summary-model';

import './room-summary.css';

import EditIcon from '../../assets/edit.png';
import LockIcon from '../../assets/lock.png';

const RoomSummary: React.FC<{
  summary: Summary;
  isLocked: boolean;
  onEdit: () => void;
}> = ({ summary, onEdit, isLocked }) => {
  const date = new Date(summary.timestamp);

  return (
    <div className="roomsummary">
      <div className="roomsummary__summary">
        <div dangerouslySetInnerHTML={{ __html: summary.text }} />
      </div>
      <div className="roomsummary__timeindicator">
        {date.toLocaleTimeString('en-US', {
          hourCycle: 'h12',
          hour: 'numeric',
          minute: '2-digit',
        })}
      </div>
      <button
        className="roomsummary__edit"
        style={{ cursor: isLocked ? 'default' : 'pointer' }}
        onClick={() => {
          if (!isLocked) onEdit();
        }}
      >
        <img
          className="roomsummary__edit__icon"
          src={isLocked ? LockIcon : EditIcon}
        />
      </button>
    </div>
  );
};

export default RoomSummary;
