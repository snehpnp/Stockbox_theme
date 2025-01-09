import React from 'react';
import Contnet from '../Content';

const StripedTable = () => {
  return (
    <Contnet Page_title="Striped Table">
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr >
          <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>ID</th>
          <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Name</th>
          <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Age</th>
        </tr>
      </thead>
      <tbody>
        <tr >
          <td style={{ padding: '12px', border: '1px solid #ddd' }}>1</td>
          <td style={{ padding: '12px', border: '1px solid #ddd' }}>John Doe</td>
          <td style={{ padding: '12px', border: '1px solid #ddd' }}>28</td>
        </tr>
        <tr>
          <td style={{ padding: '12px', border: '1px solid #ddd' }}>2</td>
          <td style={{ padding: '12px', border: '1px solid #ddd' }}>Jane Smith</td>
          <td style={{ padding: '12px', border: '1px solid #ddd' }}>35</td>
        </tr>
      </tbody>
    </table>
    </Contnet>
  );
};

export default StripedTable;
