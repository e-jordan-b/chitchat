import React, { useEffect, useState } from 'react';
import useLiveMenuSocket from '../../hooks/use-live-menu-socket';
import './room-live-menu.css';
import { Summary } from '../../models/summary-model';
import RoomSummary from './room-summary';

enum MenuState {
  SUMMARY,
  CHAT,
}

const RoomLiveMenu: React.FC<{ url: string }> = ({ url }) => {
  const { socket, socketStatus } = useLiveMenuSocket(url);
  const [menuState, setMenuState] = useState<MenuState>(MenuState.SUMMARY);
  const [summaries, setSummaries] = useState<Summary[]>([
    { _id: '215125215421', text: 'Loremipsum', timestamp: 21512 },
  ]);

  useEffect(() => {

  }, [])

  const RenderSwitch: React.FC = () => {
    switch (menuState) {
      case MenuState.SUMMARY: {
        return (
          <div className="roomlivemenu__summary">
            {summaries.map((summary) => (
              <RoomSummary summary={summary} key={summary._id} />
            ))}
          </div>
        );
      }
      case MenuState.CHAT: {
        return <div></div>;
      }
    }
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

      <RenderSwitch />
    </div>
  );
};

export default RoomLiveMenu;
