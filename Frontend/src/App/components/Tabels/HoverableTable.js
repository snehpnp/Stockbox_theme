import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Edit and Delete icons
import Switch from 'react-switch'; // Corrected import for default export
import Contnet from '../Content';

const HoverableTable = () => {
  const [isActive, setIsActive] = useState(false);

  const handleToggleChange = () => setIsActive(!isActive);

  const data = [
    { id: 1, name: 'John Doe', age: 28 },
    { id: 2, name: 'Jane Smith', age: 35 },
  ];

  return (
    <Contnet Page_title="Hoverable Table">
    <div>
      <table  className='new-table new-table-hover' style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Actions</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
            >
              <td>{row.id}</td>
              <td>{row.name}</td>
              <td>{row.age}</td>
              <td>
                <FaEdit style={{ marginRight: '10px', cursor: 'pointer' }} />
                <FaTrash style={{ cursor: 'pointer' }} />
              </td>
              <td>
                <Switch checked={isActive} onChange={handleToggleChange} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Example */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button style={{ padding: '5px 10px', marginRight: '10px' }}>Previous</button>
        <button style={{ padding: '5px 10px' }}>Next</button>
      </div>
    </div>
    </Contnet>
  );
};

export default HoverableTable;
