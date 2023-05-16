import React, { useEffect, useMemo, useRef, useState } from 'react';
import useLiveMenuSocket from '../../hooks/use-live-menu-socket';
import './room-live-menu.css';
import { Summary } from '../../models/summary-model';
import RoomSummary from './room-summary';
import RoomService from '../../services/room-service';
import { ChatMessage } from '../../models/chat-message-model';
import RoomChatMessage from './room-chat-message';

enum MenuState {
  SUMMARY,
  CHAT,
}

interface SummaryEditingState {
  isEditing: boolean;
  summaryId?: string;
}

const RoomLiveMenu: React.FC<{ url: string }> = ({ url }) => {
  const urlMemo = useMemo(() => url, [url]);
  const { sendEditUpdate, sendChatMessage, connect } = useLiveMenuSocket();
  const [menuState, setMenuState] = useState<MenuState>(MenuState.SUMMARY);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [roomService, _] = useState<RoomService>(new RoomService());
  const [localEditingState, setLocalEditingState] =
    useState<SummaryEditingState>({ isEditing: false });
  const [remoteEditingState, setRemoteEditingState] =
    useState<SummaryEditingState>({ isEditing: false });
  const intervalRef = useRef<NodeJS.Timer>();
  const renderRef = useRef<number>(0);

  useEffect(() => {
    renderRef.current++;
    console.log('RoomLiveMenu RENDERED', renderRef.current);
    console.log('CONNECTING TO ROOM SOCKET URL', url);
    connect(url, handleRemoteEditUpdate, handleChatMessage);

    fetchSummaries();
    const interval = setInterval(() => fetchSummaries(), 20000);
    intervalRef.current = interval;

    return () => clearInterval(intervalRef.current);
  }, []);

  const fetchSummaries = async () => {
    const { summaries, error } = await roomService.fetchSummaries(url);

    console.log(summaries);

    if (error) {
      console.log('RoomLiveMenu/polling error:', error);
      return;
    }

    if (summaries) {
      setSummaries(summaries);
    }
  };

  const handleRemoteEditUpdate = (summaryId: string, status: string) => {
    if (status === 'Started') {
      setRemoteEditingState({ isEditing: true, summaryId });
    }

    if (status === 'Stopped') {
      setRemoteEditingState({ isEditing: false });
    }
  };

  const handleLocalEditUpdate = (summaryId: string) => {
    if (
      remoteEditingState.isEditing &&
      remoteEditingState.summaryId === summaryId
    ) {
      return;
    }

    // Stop editing
    if (
      localEditingState.isEditing &&
      localEditingState.summaryId === summaryId
    ) {
      setLocalEditingState({ isEditing: false });
      sendEditUpdate(summaryId, 'Stopped');
    }

    // Start editing
    if (!localEditingState.isEditing) {
      setLocalEditingState({ isEditing: true, summaryId });
      sendEditUpdate(summaryId, 'Started');
    }
  };

  const handleChatMessage = (message: ChatMessage) => {
    console.log('MESSAGE', message);
    const updatedMessages = messages;
    updatedMessages.push(message);
    setMessages(updatedMessages);
  };

  const handleSummaryOnSave = async (text: string): Promise<boolean> => {
    // PUSH
    // Success w/ summary
    // setSummaries(...summary)
    // isEditing false
    // Failure
    // setSummaries with latest summary
    // isEditing false

    return true;
  };

  return (
    <div className="roomlivemenu">
      <div className="roomlivemenu__switchcontainer">
        <div
          onClick={() => setMenuState(MenuState.SUMMARY)}
          className={`roomlivemenu__switch ${
            menuState === MenuState.SUMMARY ? 'switch-selected' : ''
          }`}
        >
          Summary
        </div>
        <div
          onClick={() => setMenuState(MenuState.CHAT)}
          className={`roomlivemenu__switch ${
            menuState === MenuState.CHAT ? 'switch-selected' : ''
          }`}
        >
          Chat
        </div>
      </div>

      {/* Summary */}
      {menuState === MenuState.SUMMARY && (
        <div className="roomlivemenu__summary">
          {summaries.map((summary) => {
            return (
              <RoomSummary
                summary={summary}
                key={summary._id}
                isEditing={
                  localEditingState.isEditing &&
                  localEditingState.summaryId === summary._id
                }
                isLocked={
                  remoteEditingState.isEditing &&
                  remoteEditingState.summaryId === summary._id
                }
                onEdit={() => handleLocalEditUpdate(summary._id)}
                // onSave={(text: string) => }
              />
            );
          })}
        </div>
      )}

      {/* Chat conditional rendering */}
      {menuState === MenuState.CHAT && (
        <div className="roomlivemenu__chat">
          {messages.map((message, idx) => {
            let isFirst = true;
            if (idx > 0 && messages[idx - 1].speakerId === message.speakerId) {
              isFirst = false;
            }

            return (
              <RoomChatMessage message={message} isFirst={isFirst} key={idx} />
            );
          })}

          <input />
        </div>
      )}
    </div>
  );
};

export default RoomLiveMenu;
