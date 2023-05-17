import React from 'react';
import { useTable, CellProps, Column } from 'react-table';
import { RiFunctionLine } from 'react-icons/ri';

const data: MeetingObject[] = [
  {
    roomId: "645a205090d5f0e0b2b99689",
    createdAt: 1683628112403,
    urlUUID: "93917803-f90e-452f-b872-65092d470fe1",
    callSummary:
      "The meeting appears to have been focused on discussing various technical aspects related to a transcription service, including the use of Google API and open AI for summarization, rate limiters, and the implementation of a transcription system...",
    agenda: ["introduction", "product pipeline :rocket:", "objectives :dart:"],
  },
  // Additional objects...
];

export type MeetingObject = {
  roomId: string;
  createdAt: number;
  urlUUID: string;
  callSummary: string;
  agenda: string[];
}

export const Table = ({ data }: { data: MeetingObject[] }) => {
  const columns: Column<MeetingObject>[] = React.useMemo(
    () => [
      {
        Header: 'Created At',
        accessor: 'createdAt',
        Cell: ({ value }) => <span>{new Date(value).toLocaleString()}</span>,
      },
      {
        Header: 'Call Summary',
        accessor: 'callSummary',
      },
      {
        Header: 'Agenda',
        accessor: 'agenda',
      },
      {
        Header: 'Action',
        Cell: ({ row }: CellProps<MeetingObject>) => (
          <button
            onClick={() => handleButtonClick(row.original.roomId)}
          >
            Call Function
          </button>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  const handleButtonClick = (roomId: string) => {
    // Function to be called on button click
    console.log('Button clicked with roomId: ', roomId);
  };

  return (
    <table {...getTableProps()} className="react-table">
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};