import Swal from "sweetalert2";

export const CustomAlert = (title, icon, text = null) => {
  Swal.fire({
    title: title,
    icon: icon,
    text: text != null ? text : "",
    confirmButtonText: `
      <i class="fa fa-thumbs-up"></i> Onayla
    `,
    didOpen: () => {
      const confirmButton = Swal.getConfirmButton();
      confirmButton.style.backgroundColor = "#007bff" // Buton arka plan rengi
      confirmButton.style.color = "white"; // Buton yazı rengi
      confirmButton.style.border = "none"; // Kenarlık yok
    },
  });
};