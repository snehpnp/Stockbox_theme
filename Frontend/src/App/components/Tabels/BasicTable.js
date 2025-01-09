import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Using React Icons for edit and delete
import Contnet from '../Content';

// Sample data for the table
const initialData = [
  { id: 1, name: 'John Doe', age: 28, status: true },
  { id: 2, name: 'Jane Smith', age: 35, status: false },
  { id: 3, name: 'Mark Johnson', age: 45, status: true },
  { id: 4, name: 'Lucy Adams', age: 22, status: false },
  { id: 5, name: 'Emma Brown', age: 30, status: true },
  { id: 6, name: 'Michael Lee', age: 40, status: false },
  { id: 7, name: 'Sophia Davis', age: 25, status: true },
  { id: 8, name: 'James Williams', age: 38, status: false },
  { id: 9, name: 'Olivia Taylor', age: 29, status: true },
  { id: 10, name: 'David Harris', age: 33, status: false },
  { id: 11, name: 'Emma Clark', age: 41, status: true },
  { id: 12, name: 'Ryan Walker', age: 36, status: false },
];

const BasicTable = () => {
  const [data, setData] = useState(initialData); // Table data
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const rowsPerPage = 5; // Rows per page

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Paginate the data
  const paginate = (data, pageNumber, rowsPerPage) => {
    const indexOfLast = pageNumber * rowsPerPage;
    const indexOfFirst = indexOfLast - rowsPerPage;
    return data.slice(indexOfFirst, indexOfLast);
  };

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const currentData = paginate(data, currentPage, rowsPerPage);

  // Toggle status
  const handleToggleStatus = (id) => {
    setData(prevData =>
      prevData.map(row =>
        row.id === id ? { ...row, status: !row.status } : row
      )
    );
  };

  // Handle delete
  const handleDelete = (id) => {
    setData(prevData => prevData.filter(row => row.id !== id));
  };

  return (
    <Contnet Page_title="Basic Table">
    <div style={{ fontFamily: 'Arial, sans-serif', margin: '00px' }}>
      <table 
      className='new-table'
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          borderRadius: '0px',
          overflow: 'hidden',
        }}
      >
        <thead>
          <tr >
            <th>
              Select
            </th>
            <th>
              ID
            </th>
            <th>
              Name
            </th>
            <th>
              Age
            </th>
            <th>
              Status
            </th>
            <th>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((row) => (
            <tr
              key={row.id}
              style={{
                backgroundColor: '#f9f9f9',
                transition: 'background-color 0.3s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f1f1f1')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
            >
              <td>
                <input type="checkbox" />
              </td>
              <td>
                {row.id}
              </td>
              <td>
                {row.name}
              </td>
              <td>
                {row.age}
              </td>
              <td>
                <button
                  onClick={() => handleToggleStatus(row.id)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: row.status ? '#4CAF50' : '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  {row.status ? 'Active' : 'Inactive'}
                </button>
              </td>
              <td>
                <button
                  onClick={() => alert(`Edit user with ID: ${row.id}`)}
                  style={actionButtonStyle}
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(row.id)}
                  style={actionButtonStyle}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          style={buttonStyle}
        >
          First
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={buttonStyle}
        >
          Prev
        </button>
        <span style={{ padding: '0 10px' }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={buttonStyle}
        >
          Next
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          style={buttonStyle}
        >
          Last
        </button>
      </div>
    </div>
    </Contnet>
  );
};

const buttonStyle = {
  padding: '8px 16px',
  margin: '0 5px',
  backgroundColor: '#4CAF50',

  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const actionButtonStyle = {
  padding: '8px 12px',
  margin: '0 5px',
  backgroundColor: '#007bff',

  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default BasicTable;
