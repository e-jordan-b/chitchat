import React from 'react';
import { useTable, CellProps, Column } from 'react-table';
import { useNavigate } from 'react-router';
import {AiFillEye} from 'react-icons/ai'
import './table.css'
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
    <div className='h-full '>

    <div {...getTableProps()} className=" w-full h-full">
      <div className=" roudend-t-xl text-custom-purple-100 dark:text-white dark:border-b-4 h-20 rounded-t-xl drop-shadow-md dark:border-gray-100 dark:bg-gray-900 bg-custom-purple-900">
        {headerGroups.map(headerGroup => (
          <div {...headerGroup.getHeaderGroupProps()} className='flex justify-center rounded-t-xl h-5'>
            {headerGroup.headers.map((column , i)=> {
              let classNames = " text-2xl py-5 px-8 ";
              if (i === headerGroup.headers.length - 1) {
                classNames += " rounded-tr-xl";
              }


              switch (column.id) {
                case 'createdAt':
                  classNames += " text-left pl-4 rounded-tl-xl min-w-[200px] mt-1 ";
                  break;
                  case 'callSummary':
                    classNames += "  ml-auto mt-1";
                    break;
                case 'agenda':
                  classNames += "  ml-auto mr-5 mt-1  ";
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
      <div className="h-2/4 overflow-y-auto tablescrollbar border-l-2 mt-1">

      <div {...getTableBodyProps()} className="text-xl h-full font-medium dark:text-gray-900 ">
        {rows.map((row, i) => {
          prepareRow(row);
          let rowClass = (i % 2 === 1) ? 'bg-gray-50' : '';
          return (
            <tr {...row.getRowProps({ className: `${i !== 0 ? "pt-4" : ""} border-b-2 border-gray-300 pt-2 ${rowClass}` })}>
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
      <div className='h-5 dark:bg-gray-900 bg-custom-purple-900 rounded-b-lg'>

        <div className='rounded-bl-lg h-6'></div>
        <div></div>
        <div></div>
        <div className='rounded-br-lg'></div>
      </div>
    </div>
    </div>
        </div>
  );

}