import React from 'react';
import { render, fireEvent, screen, getByPlaceholderText } from '@testing-library/react';
import RoomPreCall from '../components/room/room-precall';

describe('RoomPreCall', () => {
  it('should call the onJoin function when the "Join Room" button is clicked with a valid name', () => {
    const onJoinMock = jest.fn();
    const inputSpeakerMock = jest.fn();

    const { getByPlaceholderText, getByText } = render(
      <RoomPreCall onJoin={onJoinMock} mediaStream={undefined} inputSpeaker={inputSpeakerMock} />
    );

    const nameInput = screen.getByPlaceholderText('Enter your name...');
    fireEvent.change(nameInput, { target: { value: 'Random Name' } });

    const joinButton = screen.getByText('Join Room');
    fireEvent.click(joinButton);

    expect(onJoinMock).toHaveBeenCalledTimes(1);

    expect(inputSpeakerMock).toHaveBeenCalledWith('Random Name');
  });

  it('should show an alert when the "Join Room" button is clicked without entering a name', () => {
    const onJoinMock = jest.fn();
    const inputSpeakerMock = jest.fn();
    const alertMock = jest.spyOn(window, 'alert')

    render(
      <RoomPreCall onJoin={onJoinMock} mediaStream={undefined} inputSpeaker={inputSpeakerMock} />
    );

    const joinButton = screen.getByText('Join Room');
    fireEvent.click(joinButton);

    expect(onJoinMock).not.toHaveBeenCalled();

    expect(alertMock).toHaveBeenCalledTimes(1);
    expect(alertMock).toHaveBeenCalledWith('You must enter a name')

    alertMock.mockRestore();
  })
})