import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CustomAlert = ({
    title = "Alert",
    message = "",
    icon = "info",
    timer = 2000,
    navigateTo = "",
}) => {
    const navigate = useNavigate();

    Swal.fire({
        title: `<strong style="
      font-size: 22px; 
      font-weight: bold; 
      color: #333;
    ">${title}</strong>`,
        html: `<p style="
      font-size: 16px;
      color: #555;
      font-weight: 500;
      text-align: center;
      margin-top: 10px;
    ">${message}</p>`,
        icon,
        showConfirmButton: false,
        timer,
        timerProgressBar: true,
        backdrop: "rgba(0, 0, 0, 0.4)",
        customClass: {
            popup: "swal-popup",
        },
        willOpen: () => {
            setTimeout(() => {
                let popup = document.querySelector(".swal-popup");
                if (popup) {
                    popup.style.cssText = `
            border-radius: 15px !important;
            padding: 25px !important;
            background: #fff !important;
            box-shadow: 0px 5px 18px rgba(0, 0, 0, 0.25);
            border: 2px solid #ddd !important;
            transition: all 0.3s ease-in-out;
          `;
                }
            }, 10);
        },
        willClose: () => {
            if (navigateTo) {
                setTimeout(() => {
                    navigate(navigateTo);
                }, 200);
            }
        },
    });
};

export default CustomAlert;



// how to use

//  CustomAlert({
//           title: "🎉 Client Created Successfully!",
//           message: "Your client has been added successfully.",
//           icon: "success",
//           timer: 2000,
//           navigateTo: "/admin/employee",
//         });