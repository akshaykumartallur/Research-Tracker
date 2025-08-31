import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';


const AdminViewAll = () => {
  const { type } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:3000/api/admin/adminGetAll?type=${type}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [type]);
      

  const exportExcel = () => {
    if (!data.length) return;
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, type);
    XLSX.writeFile(workbook, `${type}.xlsx`);
  };

  const renderTable = () => {
    if (data.length === 0) {
      return <div className="text-center py-4 text-gray-500">No {type} found.</div>;
    }

    const tableMap = {
      patents: ['Title', 'Description', 'Date', 'Added By'],
      publications: ['Title', 'Authors', 'Date', 'Added By'],
      events: ['Title', 'Description', 'Location', 'Date', 'Added By'],
      conferences: ['Title', 'Description', 'Location', 'Date', 'Added By']
    };

    const columnMap = {
      patents: ['title', 'description', 'date', 'username'],
      publications: ['title', 'authors', 'published_date', 'username'],
      events: ['title', 'description', 'location', 'date', 'username'],
      conferences: ['title', 'description', 'location', 'conference_date', 'username']
    };

    const columns = columnMap[type];
    const labels = tableMap[type];

    return (
      <div className="overflow-x-auto shadow-lg bg-white rounded-lg border p-6">
        <div className="flex justify-end mb-4 gap-3">
          <button
            onClick={exportExcel}
            className="px-5 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition duration-200"
          >
            📊 Export Excel
          </button>
        </div>
        <table className="min-w-full text-sm text-left border border-gray-200 rounded-md">
          <thead className="bg-gray-100 font-semibold text-gray-800">
            <tr>
              <th className="px-4 py-3 border">SI</th>
              {labels.map(label => (
                <th key={label} className="px-4 py-3 border">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={item.id || index}
                className={`border-t ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="px-4 py-2 border">{index + 1}</td>
                {columns.map(col => (
                  <td key={col} className="px-4 py-2 border">
                    {col.includes('date') ? new Date(item[col]).toLocaleDateString() : item[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="mt-10 px-4">
      <h2 className="text-2xl font-bold text-center mb-6 capitalize underline text-blue-700">{type} Entries</h2>
      {renderTable()}
    </div>
  );
};

export default AdminViewAll;
