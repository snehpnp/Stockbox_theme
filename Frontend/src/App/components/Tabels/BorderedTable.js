import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Make sure Bootstrap CSS is imported
import { Button, Form, Pagination, Row, Col } from 'react-bootstrap'; // Importing components from react-bootstrap
import Contnet from '../Contents/Content';

const BorderedTable = () => {
  const [isToggled, setIsToggled] = useState(false); // State for the toggle
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [data] = useState([
    { id: 1, name: 'John Doe', age: 28 },
    { id: 2, name: 'Jane Smith', age: 35 },
    { id: 3, name: 'Sam Brown', age: 22 },
    { id: 4, name: 'Mary White', age: 29 },
    { id: 5, name: 'James Green', age: 41 },
    { id: 6, name: 'Chris Blue', age: 30 },
    { id: 7, name: 'Patricia Grey', age: 36 },
    { id: 8, name: 'Linda Black', age: 27 },
    { id: 9, name: 'Michael King', age: 40 },
    { id: 10, name: 'Susan Queen', age: 33 },
  ]); // Sample data for the table

  const handleToggleChange = (e) => {
    setIsToggled(e.target.checked); // Update the state when toggle is changed
  };

  // Calculate pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Contnet Page_title="Bordered Table">
    <div>
      {/* Table */}
      <table className='new-table new-table-bordered'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Actions</th>
            <th>Select</th>
            <th>Status</th> {/* Column for toggle switch */}
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.name}</td>
              <td>{row.age}</td>
              <td>
                <Button variant="warning">Edit</Button>{' '}
                <Button variant="danger">Delete</Button>
              </td>
              <td>
                <input type="checkbox" />
              </td>
              <td>
                <Form.Check
                  type="switch"
                  id={`custom-switch-${row.id}`}
                  label={isToggled ? 'Active' : 'Inactive'}
                  checked={isToggled}
                  onChange={handleToggleChange}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Rows per page selection */}
      <Row className="mb-3">
        <Col md={6}>
          <label>Rows per page:</label>
          <Form.Control
            as="select"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </Form.Control>
        </Col>
        <Col md={6} className="text-right">
          {/* Pagination controls */}
          <Pagination>
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            />
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            />
          </Pagination>
        </Col>
      </Row>
    </div>
    </Contnet>
  );
};

export default BorderedTable;
