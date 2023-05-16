import React from 'react';
import './room-chat-message.css';

import { ChatMessage } from '../../models/chat-message-model';

const RoomChatMessage: React.FC<{ message: ChatMessage; isFirst: boolean }> = ({
  message,
  isFirst,
}) => {
  const date = new Date(message.timestamp);
  return (
    <div className="flex flex-col ml-4">
      {isFirst && (
        <div className="text-xs font-light ml-2">{`${
          message.speaker
        } • ${date.toLocaleTimeString('en-US', {
          hourCycle: 'h12',
          hour: 'numeric',
          minute: '2-digit',
        })}`}</div>
      )}
      <div className='px-1 py-2 bg-custom-purple-200 rounded-2xl mb-4 w-2/4 flex justify-center items-center text-sm'>
          <div>{message.message}</div>
      </div>
    </div>
  );
};

export default RoomChatMessage;
