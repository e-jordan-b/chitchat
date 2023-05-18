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
          <button className='flex justify-center items-center h-5 w-6 mr-2  rounded-full '
            onClick={() => handleButtonClick(row.original.roomId)}
          >
            <AiFillEye size={25} />
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
    <div className='h-4/5 '>

    <div {...getTableProps()} className="h-4/5 w-full ">
      <div className=" roudend-t-xl text-custom-purple-100 dark:text-white border-b-4 h-3/4 rounded-t-xl dark:border-gray-100 dark:bg-gray-900 bg-custom-purple-800">
        {headerGroups.map(headerGroup => (
          <div {...headerGroup.getHeaderGroupProps()} className='flex justify-center rounded-t-xl '>
            {headerGroup.headers.map((column , i)=> {
              let classNames = " text-2xl py-5 px-8 ";
              if (i === headerGroup.headers.length - 1) {
                classNames += " rounded-tr-xl";
              }
              switch (column.id) {
                case 'createdAt':
                  classNames += " text-left pl-4 rounded-tl-xl min-w-[200px] left-5 top-0  ";
                  break;
                  case 'callSummary':
                    classNames += "  ml-auto";
                    break;
                case 'agenda':
                  classNames += "  ml-auto mr-5  ";
                  break;
                case ' ':
                  classNames += "   ";
                  break;
                default:
                  classNames += " ";
              }
              return (
                <div {...column.getHeaderProps()} className={classNames}>
                  {column.render('Header')}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="bg-red-200 h-3/4 overflow-y-auto ">

      <div {...getTableBodyProps()} className="text-xl h-4/5 font-medium dark:text-gray-900 ">
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} className={`${i !== 0 ? "pt-4" : ""} border-b-2 border-gray-300 pt-2`}>
              {row.cells.map((cell) => {
                let classNames = "pl-4 py-2 dark:bg-gray-200";
                switch (cell.column.id) {
                  case 'createdAt':
                    classNames += " ";
                    break;
                    case 'callSummary':
                      classNames += "  truncate  max-w-[500px] ";
                      break;
                      case 'agenda':
                        classNames += " truncate max-w-[200px]  ";
                        break;
                        case 'action':
                    classNames += "  flex justify-center items-center ";
                    break;
                    default:
                      classNames += " pl-6";
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
      </div>
      </div>
      <div>
      <tr className='h-5 dark:bg-gray-900 bg-gray-600 rounded-b-lg'>

        <td className='rounded-bl-lg h-6'></td>
        <td></td>
        <td></td>
        <td className='rounded-br-lg'></td>
      </tr>
    </div>
    </div>
        </div>
  );

}