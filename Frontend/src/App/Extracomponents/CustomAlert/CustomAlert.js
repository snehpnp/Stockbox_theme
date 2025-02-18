import Swal from "sweetalert2";

const showCustomAlert = (message, navigate, redirectTo) => {
  Swal.fire({
    title: "🎉 Success!",
    text: message,
    icon: "success",
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
    didClose: () => {
      navigate(redirectTo);
    },
    width: '90%',
    padding: '0',
    background: 'transparent',
    html: `
      <div style="width: 90%; background-color: white; border-radius: 10px; animation: 0.5s 1 alert_container_animation; position: relative;">
        <div style="padding: 20px; border-radius: 10px 10px 0px 0px; text-align: center; background: linear-gradient(80deg, #67FF86, #1FB397);">
          <h1>🎉 Success!</h1>
        </div>
        <div style="padding: 15px; text-align: center;">
          <h2 style="font-size: 20px;">Congratulations!</h2>
          <p style="font-size: 14px; color: #525252; line-height: 1.5em; margin-top: 5px;">${message}</p>
        </div>
       
      </div>
    `,
    customClass: {
      popup: "alert_modal",
      title: "alert_heading",
      content: "alert_details",
      footer: "alert_footer",
    },
    animation: "0.5s ease-in-out",
  });
};

export default showCustomAlert;
