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

const RoomLiveMenu: React.FC<{ url: string }> = ({ url }) => {
  const { socket, socketStatus, connect } = useLiveMenuSocket();
  const [menuState, setMenuState] = useState<MenuState>(MenuState.SUMMARY);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [roomService, _] = useState<RoomService>(new RoomService());
  const intervalRef = useRef<NodeJS.Timer>();
  const editingSummary = useRef<{ isEditing: boolean; id: string }>();

  useEffect(() => {
    connect(url);

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

  const handleSummaryEditing = (id: string, status: string) => {
    const state = editingSummary.current;
    if (state && state.isEditing && state.id !== id) {
      socket?.send(
        JSON.stringify({
          type: 'Editing',
          payload: { status: 'Ended', id: state.id },
        })
      );
    }
    editingSummary.current = { isEditing: status === 'Started', id };
    socket?.send(JSON.stringify({ type: 'Editing', payload: { status, id } }));
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
                onEditStart={() => handleSummaryEditing(summary._id, 'Started')}
                onEditEnd={() => handleSummaryEditing(summary._id, 'Ended')}
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
