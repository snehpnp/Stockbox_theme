import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Contnet from "../../components/Content";
import { GetAllThemesApi, GetThemeByIdApi } from "../../Services/Themes/Theme";

function Theme() {
  const navigate = useNavigate();
  const [themes, setThemes] = useState([]);

  const handleEdit = (id) => {
    navigate(`/edit-theme/${id}`);
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/themes/${id}`)
      .then((response) => {
        GetAllThemes();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleAddTheme = () => {
    navigate("/add-theme");
  };

  const GetAllThemes = async () => {
    try {
      const response = await GetAllThemesApi();
      setThemes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch and store the selected theme in localStorage
  const applyTheme = async (id) => {
    try {
      const response = await GetThemeByIdApi(id);

      const themeData = response.data;

      localStorage.setItem("theme", JSON.stringify(themeData));
      window.location.reload();
      
    } catch (error) {
      console.error("Error applying theme:", error);
    }
  };

  useEffect(() => {
    GetAllThemes();
  }, []);

  return (
    <Contnet
      Page_title="Themes"
      button_title="Add Theme"
      button_status={false}
      route="/add-theme"
    >
      <div >
        {/* Heading */}
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Themes</h1>

        {/* Add Theme Button */}
        <div style={{ textAlign: "right", marginBottom: "10px" }}>
          <button
            onClick={handleAddTheme}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4caf50",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            + Add Theme
          </button>
        </div>

        {/* Table Wrapped in a Card */}
        <div style={cardStyle}>
          <h3 style={cardHeaderStyle}>Theme List</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>ID</th>
                <th style={tableHeaderStyle}>Theme Name</th>
                <th style={tableHeaderStyle}>Active</th>
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {themes.map((theme, index) => (
                <tr key={theme.id}>
                  <td style={tableCellStyle}>{index + 1}</td>
                  <td style={tableCellStyle}>{theme.ThemeName}</td>
                  <td style={tableCellStyle}>
                    {theme.status ? "Active" : "Inactive"}
                  </td>
                  <td style={tableCellStyle}>
                    <button
                      onClick={() => handleEdit(theme._id)}
                      style={editButtonStyle}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(theme._id)}
                      style={deleteButtonStyle}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => applyTheme(theme._id)}
                      style={applyButtonStyle}
                    >
                      Apply
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Contnet>
  );
}

// Inline Styles
const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  padding: "20px",
  backgroundColor: "#fff",
  marginTop: "20px",
};

const cardHeaderStyle = {
  marginBottom: "15px",
  borderBottom: "1px solid #eee",
  paddingBottom: "10px",
  fontSize: "1.2rem",
};

const tableHeaderStyle = {
  backgroundColor: "#f2f2f2",
  borderBottom: "2px solid #ddd",
  padding: "10px",
  textAlign: "left",
};

const tableCellStyle = {
  borderBottom: "1px solid #ddd",
  padding: "10px",
};

const editButtonStyle = {
  backgroundColor: "#1976D2",
  color: "#fff",
  border: "none",
  padding: "5px 10px",
  marginRight: "5px",
  cursor: "pointer",
  borderRadius: "4px",
};

const deleteButtonStyle = {
  backgroundColor: "#D32F2F",
  color: "#fff",
  border: "none",
  padding: "5px 10px",
  cursor: "pointer",
  borderRadius: "4px",
};

const applyButtonStyle = {
  backgroundColor: "#4caf50",
  color: "#fff",
  border: "none",
  padding: "5px 10px",
  cursor: "pointer",
  borderRadius: "4px",
};

export default Theme;
