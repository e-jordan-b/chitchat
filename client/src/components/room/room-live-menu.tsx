import React, { useEffect, useRef, useState } from 'react';
import useLiveMenuSocket from '../../hooks/use-live-menu-socket';
import './room-live-menu.css';
import { Summary } from '../../models/summary-model';
import RoomSummary from './room-summary';
import RoomService from '../../services/room-service';

enum MenuState {
  SUMMARY,
  CHAT,
}

interface SummaryEditingState {
  isEditing: boolean;
  summaryId?: string;
}

const RoomLiveMenu: React.FC<{ url: string }> = ({ url }) => {
  const { sendEditUpdate, sendChatMessage, connect } = useLiveMenuSocket();
  const [menuState, setMenuState] = useState<MenuState>(MenuState.SUMMARY);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [roomService, _] = useState<RoomService>(new RoomService());
  const [localEditingState, setLocalEditingState] =
    useState<SummaryEditingState>({ isEditing: false });
  const [remoteEditingState, setRemoteEditingState] =
    useState<SummaryEditingState>({ isEditing: false });
  const intervalRef = useRef<NodeJS.Timer>();

  useEffect(() => {
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

  const handleChatMessage = (message: {
    timestamp: number;
    speaker: string;
    message: string;
  }) => {
    console.log(message);
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
            console.log(summary._id);
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
              />
            );
          })}
        </div>
      )}

      {/* Chat conditional rendering */}
      {menuState === MenuState.CHAT && (
        <div className="roomlivemenu__chat">CHAT</div>
      )}
    </div>
  );
};

export default RoomLiveMenu;
