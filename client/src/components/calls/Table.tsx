import React from 'react';
import { useTable, CellProps, Column } from 'react-table';
import { useNavigate } from 'react-router';
import {AiFillEye} from 'react-icons/ai'

export type MeetingObject = {
  roomId: string;
  createdAt: number;
  urlUUID: string;
  callSummary: string;
  agenda: string[];
}

export const Table = ({ data }: { data: MeetingObject[] }) => {
  const navigate = useNavigate();


  const columns: Column<MeetingObject>[] = React.useMemo(
    () => [
      {
        Header: 'Date',
        accessor: 'createdAt',
        Cell: ({ value }) => {
          const date = new Date(value);
          return <span>{date.toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>;
        },
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
        Header: ' ',
        Cell: ({ row }: CellProps<MeetingObject>) => (
          <button className='flex justify-center '
            onClick={() => handleButtonClick(row.original.roomId)}
          >
            <AiFillEye/>
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
    console.log('Button clicked with roomId: ', roomId);
  };


  return (
    <table {...getTableProps()} className="react-table w-full rounded-tr-xl ">
      <thead className="bg-custom-purple-400 text-white border-b-2 border-custom-purple-50 roudend-tr-xl">
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column , i)=> {
              let classNames = " py-3";
              if (i === headerGroup.headers.length - 1) {
                classNames += " rounded-tr-xl";
              }
              switch (column.id) {
                case 'createdAt':
                  classNames += "text-left rounded-tl-xl min-w-[200px]";
                  break;
                case 'callSummary':
                  classNames += " ";
                  break;
                case 'agenda':
                  classNames += "  ";
                  break;
                case 'action':
                  classNames += "  bg-custom-purple-200 rounded-tr-xl";
                  break;
                default:
                  classNames += " bg-custom-purple-400";
              }
              return (
                <th {...column.getHeaderProps()} className={classNames}>
                  {column.render('Header')}
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()} className="bg-custom-purple-50">
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} className={i !== 0 ? "pt-4" : ""}>
              {row.cells.map((cell) => {
                let classNames = "px-4 py-2 border-b-2 border-custom-purple-50";
                switch (cell.column.id) {
                  case 'createdAt':
                    classNames += "";
                    break;
                  case 'callSummary':
                    classNames += "  truncate  max-w-[500px] ";
                    break;
                  case 'agenda':
                    classNames += " truncate max-w-[200px]  ";
                    break;
                  case 'action':
                    classNames += "  flex justify-center items-center";
                    break;
                  default:
                    classNames += " bg-custom-purple-50";
                }
                return (
                  <td
                    {...cell.getCellProps()}
                    className={classNames}
                  >
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
      <tfoot>
      <tr className='h-5 bg-custom-purple-50 rounded-b-lg'>

        <td className='rounded-bl-lg h-10'></td>
        <td></td>
        <td></td>
        <td className='rounded-br-lg'></td>
      </tr>
    </tfoot>
    </table>
  );

}