import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Contnet from '../Content';

const CardTable = () => {
  const initialData = [
    { id: 1, name: 'John Doe', age: 28, email: 'john@example.com', status: true },
    { id: 2, name: 'Jane Smith', age: 35, status: false },
    { id: 3, name: 'David Lee', age: 42, email: 'david@example.com', status: true },
    { id: 4, name: 'Emily White', age: 24, status: true },
    { id: 5, name: 'Michael Brown', age: 30, email: 'michael@example.com', status: false },
    { id: 6, name: 'Ashley Davis', age: 29, status: true },
    { id: 7, name: 'Kevin Wilson', age: 38, email: 'kevin@example.com', status: false },
    { id: 8, name: 'Jessica Garcia', age: 26, status: true },
    { id: 9, name: 'William Rodriguez', age: 31, email: 'william@example.com', status: false },
    { id: 10, name: 'Sarah Martinez', age: 27, status: true },
  ];

  const [data, setData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const handleStatusChange = (id) => {
    setData(data.map(item =>
        item.id === id ? {...item, status: !item.status} : item
      ));
  }

  const handleDelete = (id) => {
    setData(data.filter(item => item.id !== id));
  }

  const styles = {
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      padding: '20px',
    },
    card: {
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      backgroundColor: 'white',
      transition: 'transform 0.2s',
      ':hover': { transform: 'scale(1.02)' },
      padding: "10px"
    },
    cardHeader: {
        backgroundColor: '#f0f0f0',
        padding: '10px',
        borderBottom: '1px solid #ddd',
        fontWeight: "bold",
        display: "flex",
        alignItems: "center"
    },
    idLabel: {
        marginRight: "5px"
    },
    cardBody: {
      padding: '15px',
    },
    infoRow: {
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'baseline',
    },
    label: {
      fontWeight: 'bold',
      marginRight: '5px',
      minWidth: '60px',
      display: 'inline-block'
    },
    value: {
      flexGrow: 1
    },
      pagination: {
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px',
      },
    paginationButton: {
      padding: '8px 16px',
      margin: '0 5px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    switch: {
      position: 'relative',
      display: 'inline-block',
      width: '60px',
      height: '34px',
    },
    switchInput: {
      opacity: 0,
      width: 0,
      height: 0,
    },
    slider: {
      position: 'absolute',
      cursor: 'pointer',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#ccc',
      transition: '.4s',
      borderRadius: '34px',
    },
    sliderBefore: {
      position: 'absolute',
      content: '""',
      height: '26px',
      width: '26px',
      left: '4px',
      bottom: '4px',
      backgroundColor: 'white',
      transition: '.4s',
      borderRadius: '50%',
    },
  };

  return (
    <Contnet Page_title="Card Table" button_title="Back" button_status={false}>
    <div>
      <div style={styles.container}>
        {currentItems.map((item) => (
          <div key={item.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.idLabel}>ID:</span> <span style={styles.idValue}>{item.id}</span>
            </div>
            <div style={styles.cardBody}>
              <div style={styles.infoRow}>
                <span style={styles.label}>Name:</span> <span style={styles.value}>{item.name}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.label}>Age:</span> <span style={styles.value}>{item.age}</span>
              </div>
              {item.email && (
                <div style={styles.infoRow}>
                  <span style={styles.label}>Email:</span> <span style={styles.value}>{item.email}</span>
                </div>
              )}
              <div style={styles.infoRow}>
                <span style={styles.label}>Status:</span>
                <label style={styles.switch}>
                  <input type="checkbox" checked={item.status} style={styles.switchInput} onChange={() => handleStatusChange(item.id)} />
                  <span style={styles.slider}>
                    <span style={styles.sliderBefore}></span>
                  </span>
                </label>
              </div>
              <div style={{...styles.infoRow, justifyContent: "flex-end"}}>
                <FaEdit style={{ cursor: 'pointer', marginRight: '10px', color: 'blue' }} onClick={() => alert('Edit for ID: ' + item.id)} />
                <FaTrash style={{ cursor: 'pointer', color: 'red' }} onClick={() => handleDelete(item.id)}/>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={styles.pagination}>
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} style={styles.paginationButton}>
          Prev
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} style={styles.paginationButton}>
          Next
        </button>
      </div>
    </div>
    </Contnet>
  );
};

export default CardTable;