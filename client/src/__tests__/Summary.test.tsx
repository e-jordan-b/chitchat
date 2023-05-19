import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import RoomSummary from '../components/room/room-summary';

describe('RoomSummary', () => {
  const summary = {
    _id: '123',
    text: 'Sample summary text',
    timestamp:123,
  };

  it('renders the summary text correctly', () => {
    render(
      <RoomSummary summary={summary} isLocked={false} onEdit={() => {}} />
    );

    expect(screen.getByText('Sample summary text')).toBeInTheDocument();
  });

  it('calls the onEdit function when edit button is clicked', () => {
    const mockOnEdit = jest.fn();
    render(
      <RoomSummary summary={summary} isLocked={false} onEdit={mockOnEdit} />
    );

    const editButton = screen.getByTestId('edit-button');
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalled();
  });

  it('does not call the onEdit function when the component is locked', () => {
    const mockOnEdit = jest.fn();
    render(
      <RoomSummary summary={summary} isLocked={true} onEdit={mockOnEdit} />
    );

    const editButton = screen.getByTestId('edit-button');
    fireEvent.click(editButton);

    expect(mockOnEdit).not.toHaveBeenCalled();
  });
});