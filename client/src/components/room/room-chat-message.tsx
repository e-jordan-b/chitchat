import React from 'react';
import './room-chat-message.css';

import { ChatMessage } from '../../models/chat-message-model';

const RoomChatMessage: React.FC<{ message: ChatMessage; isFirst: boolean }> = ({
  message,
  isFirst,
}) => {
  const date = new Date(message.timestamp);
  return (
    <div className="roomchatmessage">
      {isFirst && (
        <div className="rooomchatmessage__info">{`${
          message.speaker
        } • ${date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })}`}</div>
      )}
      <div className="roomchatmessage__bubble">{message.message}</div>
    </div>
  );
};

export default RoomChatMessage;
