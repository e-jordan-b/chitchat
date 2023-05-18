import React from 'react';
import { useTable, CellProps, Column } from 'react-table';
import { useNavigate } from 'react-router';
import {AiFillEye} from 'react-icons/ai'
import './table.css'
import { TbHeartMinus } from 'react-icons/tb';
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
          <button className=' flex justify-center items-center h-5 w-6 mr-2 rounded-full '
            onClick={() => handleButtonClick(row.original.urlUUID)}
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

  const handleButtonClick = (roomId: any) => {
    navigate(`/calls/summary/${roomId}`);
  };


  return (
    <div className='flex flex-col justify-center items-center h-full mt-20'>

    <div {...getTableProps()} className=" w-full h-full">
      <div className=" text-white h-[70px] rounded-t-xl drop-shadow-lg dark:border-gray-100 bg-custom-purple-500">
         {/* //bg-gradient-to-r from-gradient-pink to-gradient-blue */}

        {headerGroups.map(headerGroup => (
          <div {...headerGroup.getHeaderGroupProps()} className='flex justify-center rounded-t-xl h-5 font-semibold'>
            {headerGroup.headers.map((column , i)=> {
              let classNames = " text-2xl py-5 px-8 ";
              if (i === headerGroup.headers.length - 1) {
                classNames += " rounded-tr-xl";
              }


              switch (column.id) {
                case 'createdAt':
                  classNames += "ml-14 text-left pl-4 rounded-tl-xl min-w-[200px]  ";
                  break;
                  case 'callSummary':
                    classNames += "  ml-auto ";
                    break;
                case 'agenda':
                  classNames += "  ml-auto   ";
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
      <div className="h-2/4 overflow-y-auto tablescrollbar ">

      <div {...getTableBodyProps()} className="text-xl h-full font-medium bg-gray-50 dark:text-gray-900 ">
        {rows.map((row, i) => {
          prepareRow(row);
          let rowClass = (i % 2 === 1) ? ' dark:bg-gray-50 bg-gray-50' : 'bg-gray-100';
          return (

            // styling the table was a nightmare. tables dont take margin and without super custom components you cannot get a scrollbar inside
            // the tr element is throwing an error in the console but i choose to ignore it <:

            <tr {...row.getRowProps({ className: `${i !== 0 ? "mt-4" : ""} border-b-2 border-gray-300 pt-2 ${rowClass}` })}>
              {row.cells.map((cell) => {
                let classNames = "pl-4 py-2 ";



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
      <div className='h-5 dark:bg-gray-900 bg-gradient-to-r from-gradient-pink to-gradient-blue rounded-b-lg'>

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