import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import RoomEditSummary from '../components/room/room-edit-summary';

describe('RoomEditSummary', () => {
  const summary = {
    _id: '123',
    timestamp: 123,
    text: 'Sample summary text',
  };

  it('calls the onClose function with the original summary when the close button is clicked', () => {
    const mockOnClose = jest.fn();
    render(
      <RoomEditSummary summary={summary} onClose={mockOnClose} />
    );

    const closeButton = screen.getByTestId('close-button')
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledWith(summary);
  });

  it('calls the onSave function when the save button is clicked', () => {
    const mockOnClose = jest.fn();
    render(
      <RoomEditSummary summary={summary} onClose={mockOnClose} />
    );
    const saveButton = screen.getByTestId('save-button')
    fireEvent.click(saveButton);

    expect(mockOnClose).not.toHaveBeenCalled();
  });
});