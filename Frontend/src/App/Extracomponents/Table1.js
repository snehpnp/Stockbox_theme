import React from 'react';
import DataTable from 'react-data-table-component';

const Table = ({ columns, data, totalRows, currentPage, onPageChange }) => {
    return (
        <div className="table-responsive" style={tableContainerStyle}>
            <DataTable
                columns={columns}
                data={data}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                paginationDefaultPage={currentPage}
                onChangePage={onPageChange}
                highlightOnHover
                striped
                customStyles={customStyles}
                responsive={true}
                paginationComponentOptions={{ rowsPerPageText: '', noRowsPerPage: true }}
            />
        </div>
    );
};

const tableContainerStyle = {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    display: 'block',
    maxWidth: '100%',
    overflowX: 'auto',
};

const customStyles = {
    header: {
        style: {
            minHeight: '60px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            fontSize: '16px',
            fontWeight: '600',
            borderRadius: '10px 10px 0 0',
            textAlign: 'center',
        },
    },
    headRow: {
        style: {
            borderBottomWidth: '2px',
            borderBottomColor: '#ddd',
            borderBottomStyle: 'solid',
            backgroundColor: '#f1f1f1',
        },
    },
    headCells: {
        style: {
            fontWeight: 'bold',
            fontSize: '15px',
            color: '#333',
            padding: '10px 20px',
            textAlign: 'center',
            whiteSpace: 'nowrap',
        },
    },
    cells: {
        style: {
            padding: '12px 20px',
            fontSize: '14px',
            color: '#555',
            fontWeight: 'bold',
            backgroundColor: '#fff',
            borderBottom: '1px solid #eee',
            textAlign: 'center',
            transition: 'background-color 0.3s',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },
        activeStyle: {
            backgroundColor: '#e7f7e7',
        },
    },
    rows: {
        highlightOnHoverStyle: {
            backgroundColor: '#f0f8ff',
            cursor: 'pointer',
        },
        stripedStyle: {
            backgroundColor: '#f9f9f9',
        },
    },
};

export default Table;
