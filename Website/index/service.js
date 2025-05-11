document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const selectedService = params.get("service");

    // Hide all service-home sections
    const sections = document.querySelectorAll(".service-home");
    sections.forEach(section => section.style.display = "none");

    // Show only the matching section
    if (selectedService) {
      const target = document.getElementById(selectedService);
      if (target) {
        target.style.display = "block";
      }
    }
  });