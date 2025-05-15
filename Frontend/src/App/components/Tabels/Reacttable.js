import React, { useState, useMemo } from 'react';
import { useTable, usePagination } from 'react-table';
import Contnet from '../Contents/Content';
import { FaEdit, FaTrash } from 'react-icons/fa'; // सुनिश्चित करें कि react-icons स्थापित है

const dummyData = [
    { id: 1, name: 'John Doe', age: 30, email: 'john.doe@example.com', status: true },
    { id: 2, name: 'Jane Smith', age: 25, email: 'jane.smith@example.com', status: false },
    { id: 3, name: 'Peter Jones', age: 40, email: 'peter.jones@example.com', status: true },
    { id: 4, name: 'Alice Johnson', age: 28, email: 'alice.johnson@example.com', status: false },
    { id: 5, name: 'Bob Williams', age: 35, email: 'bob.williams@example.com', status: true },
    { id: 6, name: 'Eva Brown', age: 22, email: 'eva.brown@example.com', status: false },
    { id: 7, name: 'Michael Davis', age: 45, email: 'michael.davis@example.com', status: true },
    { id: 8, name: 'Sophia Rodriguez', age: 29, email: 'sophia.rodriguez@example.com', status: false },
    { id: 9, name: 'David Wilson', age: 32, email: 'david.wilson@example.com', status: true },
    { id: 10, name: 'Olivia Garcia', age: 27, email: 'olivia.garcia@example.com', status: false },
];

function Reacttabel() {
  const [data, setData] = useState(dummyData);

  const columns = useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Name', accessor: 'name' },
      { Header: 'Age', accessor: 'age' },
      { Header: 'Email', accessor: 'email' },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value, row }) => (
          <button
            onClick={() => {
              const newData = [...data];
              newData[row.index].status = !value;
              setData(newData);
            }}
            style={{
              backgroundColor: value ? 'green' : 'red',
            
              padding: '5px 10px',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer', // Add cursor pointer for better UX
            }}
          >
            {value ? 'On' : 'Off'}
          </button>
        ),
      },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <div style={{ display: 'flex', alignItems: 'center' }}> {/* Flexbox for alignment */}
            <FaEdit
              style={{ cursor: 'pointer', marginRight: '10px', color: 'blue' }} // Added color
              onClick={() => alert('Edit clicked for row ID: ' + row.original.id)}
            />
            <FaTrash
              style={{ cursor: 'pointer', color: 'red' }} // Added color
              onClick={() => {
                const newData = data.filter((item) => item.id !== row.original.id);
                setData(newData);
              }}
            />
          </div>
        ),
      },
    ],
    [data]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable({ columns, data, initialState: { pageIndex: 0 } }, usePagination);

  return (

  <Contnet Page_title="React Table">
    <div style={{ fontFamily: 'Arial, sans-serif', margin: '00px' }}>

    <table  className='new-table' {...getTableProps()} style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '0px', }}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} style={{backgroundColor: row.index % 2 === 0 ? '#ffffff' : '#f9f9f9'}}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} style={paginationButtonStyle}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage} style={paginationButtonStyle}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage} style={paginationButtonStyle}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageOptions.length - 1)} disabled={!canNextPage} style={paginationButtonStyle}>
          {'>>'}
        </button>{' '}
        <span style={{ margin: '0 10px' }}>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span style={{ margin: '0 10px' }}>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: '50px', marginLeft: '5px', padding: '5px', border: '1px solid #ccc', borderRadius: '3px'}}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
          style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '3px', marginLeft: '10px' }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
    </Contnet>
  );
}

const paginationButtonStyle = {
    padding: '5px 10px',
    margin: '0 5px',
    border: '1px solid #ccc',
    borderRadius: '3px',
    cursor: 'pointer'
}

export default Reacttabel;