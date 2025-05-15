import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Contnet from "../../../components/Contents/Content";
import { GetAllThemesApi, GetThemeByIdApi, DeleteThemeApi } from "../../../Services/Themes/Theme";
import Swal from "sweetalert2";
import Loader from "../../../../Utils/Loader";


function Theme() {
  const navigate = useNavigate();
  const [themes, setThemes] = useState([]);

  const [isLoader,setIsLoader] = useState(true)

  const handleEdit = (id) => {
    navigate(`/superadmin/edit-theme/${id}`);
  };



  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't To Delete This Theme!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteThemeApi(id)
          .then((response) => {
            Swal.fire("Deleted!",
              "Your theme has been deleted.",
              "success");
            GetAllThemes();
          })
          .catch((error) => {
            console.error(error);
            Swal.fire("Error!",
              "There was an error deleting the theme.",
              "error");
          });
      }
    });
  };
  ;

  const handleAddTheme = () => {
    navigate("/superadmin/add-theme");
  };

  const GetAllThemes = async () => {
    try {
      const response = await GetAllThemesApi();
      setThemes(response.data);
      setIsLoader(false)
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch and store the selected theme in localStorage
  const applyTheme = async (id) => {
    try {
      const response = await GetThemeByIdApi(id);

      let themeData = response.data;

      localStorage.setItem("theme", JSON.stringify(themeData));

      document.documentElement.style.setProperty("--BtnPriTxtCol", themeData?.BtnPriTxtCol);
      document.documentElement.style.setProperty("--BtnSecTxtCol", themeData?.BtnSecTxtCol);
      document.documentElement.style.setProperty("--BtnBorderColor", themeData?.BtnBorderColor);
      document.documentElement.style.setProperty("--BtnSecBorderColor", themeData?.BtnSecBorderColor);
      document.documentElement.style.setProperty("--BtnPriBgCol", themeData?.BtnPriBgCol);
      document.documentElement.style.setProperty("--BtnSecBgCol", themeData?.BtnSecBgCol);
      document.documentElement.style.setProperty("--headSidebarFontCol", themeData?.headSidebarFontCol);
      document.documentElement.style.setProperty("--headSidebarFontActiveCol", themeData?.headSidebarFontActiveCol);
      document.documentElement.style.setProperty("--HeadingColor", themeData?.HeadingColor);
      document.documentElement.style.setProperty("--sidebarColor", themeData?.sidebarColor);
      document.documentElement.style.setProperty("--tabelheadbgcolor", themeData?.tabelheadbgcolor);

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
      button_status={true}
      route="/superadmin/add-theme"

    >
      <div >


      {isLoader?(
    <Loader/>
  ):(<>

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
        </>)}
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
