document.addEventListener('DOMContentLoaded', (event) => {
  const overlay = document.querySelector(".overlay");
  const sidebar = document.querySelector(".sidebar");
  const closeOverlayBtn = document.querySelector(".button--close");

  // Ranking logic
  const sidebarClose = () => {
    sidebar.classList.remove("is-open");
    overlay.style.opacity = 0;
    setTimeout(() => {
      overlay.classList.remove("is-open");
      overlay.style.opacity = 1;
    }, 300);
  };

  closeOverlayBtn.addEventListener("click", function () {
    sidebarClose();
  });

  overlay.addEventListener("click", function () {
    sidebarClose();
  });
});

