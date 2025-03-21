import Swal from "sweetalert2";

const showCustomAlert = (type, message, navigate, redirectTo, onConfirm) => {
  return new Promise((resolve) => {
    const theme = JSON.parse(localStorage.getItem("theme")) || {};

    let title = "🎉 Success!";
    let bgColor = theme.BtnPriBgCol || "#3e1b4a";
    let textColor = theme.BtnPriTxtCol || "#ffffff";
    let confirmBtnColor = theme.BtnPriBgCol || "#3e1b4a";
    let cancelBtnColor = theme.BtnSecBgCol || "#6c757d";
    let confirmTextColor = theme.BtnPriTxtCol || "#ffffff";
    let cancelTextColor = theme.BtnSecTxtCol || "#ffffff";

    if (type === "error") {
      title = "❌ Warning !";
      bgColor = theme.BtnPriBgCol || "#d9534f";
      textColor = theme.BtnPriTxtCol || "#ffffff";
    } else if (type === "confirm") {
      title = "⚠️ Are you sure?";
      bgColor = theme.BtnPriBgCol || "#f0ad4e";
      textColor = theme.BtnPriTxtCol || "#ffffff";
    }

    if (type === "confirm") {
      Swal.fire({
        width: "400px",
        padding: "0",
        background: "transparent",
        showConfirmButton: false,
        showCancelButton: false,
        html: `
          <div style="width: 100%; height: auto; max-height: 250px; 
            border-radius: 12px; box-shadow: 0 6px 15px rgba(0,0,0,0.2); overflow: hidden; position: relative; 
            background: ${theme.WrapperColor || "#fff"}; text-align: center;">
            
            <div style="padding: 20px; border-radius: 12px 12px 0 0; text-align: center;
              background: ${bgColor}; color: ${textColor}; font-weight: bold;">
              <h1 style="margin: 0; font-size: 20px;">${title}</h1>
            </div>
            
            <div style="padding: 20px; color: ${theme.fontColor || "#000"};">
              <p style="font-size: 16px; margin: 5px 0;">${message}</p>
            </div>

            <div style="display: flex; justify-content: center; padding: 10px;">
              <button id="confirmBtn" style="background: ${confirmBtnColor}; color: ${confirmTextColor}; 
                border: none; padding: 10px 20px; margin: 5px; border-radius: 8px; cursor: pointer; font-size: 14px;">
                Yes
              </button>
              <button id="cancelBtn" style="background: ${cancelBtnColor}; color: ${cancelTextColor}; 
                border: none; padding: 10px 20px; margin: 5px; border-radius: 8px; cursor: pointer; font-size: 14px;">
                No
              </button>
            </div>
          </div>
        `,
        didRender: () => {
          document.getElementById("confirmBtn").addEventListener("click", () => {
            Swal.close();
            resolve(true); // Confirmed
          });
          document.getElementById("cancelBtn").addEventListener("click", () => {
            Swal.close();
            resolve(false); // Cancelled
          });
        },
      });
    } else {
      Swal.fire({
        width: "400px",
        padding: "0",
        background: "transparent",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didClose: () => {
          if (redirectTo === "back") {
            window.history.back();
          } else if (navigate && redirectTo) {
            navigate(redirectTo);
          }
        },
        html: `
          <div style="width: 100%; height: auto; max-height: 250px; 
            border-radius: 12px; box-shadow: 0 6px 15px rgba(0,0,0,0.2); overflow: hidden; position: relative; 
            background: ${theme.WrapperColor || "#fff"}; text-align: center;">
            
            <div style="padding: 20px; border-radius: 12px 12px 0 0; text-align: center;
              background: ${bgColor}; color: ${textColor}; font-weight: bold;">
              <h1 style="margin: 0; font-size: 20px;">${title}</h1>
            </div>
            
            <div style="padding: 20px; color: ${theme.fontColor || "#000"};">
              <p style="font-size: 16px; margin: 5px 0;">${message}</p>
            </div>
          </div>
        `,
      });
      resolve(); // Resolve immediately for non-confirm alerts
    }
  });
};

export default showCustomAlert;
