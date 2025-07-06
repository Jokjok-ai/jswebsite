// assets/js/script.js

document.addEventListener("DOMContentLoaded", () => {
  // ---- Dynamic Text (Typing Effect) ----
  const dynamicText = document.getElementById("dynamic-text");
  const roles = ["Software Engineer", "Web Developer", "Mobile Developer"];
  let currentIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 150; // Kecepatan ketik per karakter
  const deletingSpeed = 100; // Kecepatan hapus per karakter
  const delayBetweenRoles = 2000; // Jeda sebelum mengetik peran berikutnya

  function typeAndDelete() {
    const currentRole = roles[currentIndex];
    // Mengurangi charIndex jika sedang menghapus, menambah jika mengetik
    if (isDeleting) {
      dynamicText.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      dynamicText.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let currentSpeed = isDeleting ? deletingSpeed : typingSpeed;

    // Logika untuk beralih antara mengetik dan menghapus
    if (!isDeleting && charIndex === currentRole.length) {
      currentSpeed = delayBetweenRoles; // Jeda setelah selesai mengetik
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      currentIndex = (currentIndex + 1) % roles.length; // Pindah ke peran berikutnya
      currentSpeed = 500; // Jeda singkat setelah selesai menghapus sebelum mulai mengetik lagi
    }

    setTimeout(typeAndDelete, currentSpeed);
  }

  // Hanya jalankan jika elemen dynamicText ada
  if (dynamicText) {
    typeAndDelete(); // Memulai efek typing saat halaman dimuat
  }

  // --- Mobile Menu Functionality ---
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const closeMobileMenuButton = document.getElementById("close-mobile-menu");
  const mobileMenu = document.getElementById("mobile-menu");

  // --- Sub-menu Specific Elements ---
  const projectsMenuToggle = document.getElementById("projects-menu-toggle");
  const submenuProjects = document.getElementById("submenu-projects");
  const projectsToggleIcon = document.getElementById("projects-toggle-icon"); // Referensi ke ikon SVG

  // Cek apakah elemen menu mobile ada sebelum menambahkan event listener
  if (mobileMenuButton && mobileMenu) {
    // Dapatkan semua link di dalam menu mobile, KECUALI link yang menjadi toggle sub-menu
    const mobileMenuLinks = mobileMenu.querySelectorAll(
      "a:not(#projects-menu-toggle)"
    );

    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.remove("hidden");
      mobileMenu.classList.add("flex");
      setTimeout(() => {
        mobileMenu.classList.remove("-translate-x-full");
        mobileMenu.classList.add("translate-x-0");
      }, 10);
    });

    closeMobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.add("-translate-x-full");
      mobileMenu.classList.remove("translate-x-0");
      setTimeout(() => {
        mobileMenu.classList.add("hidden");
        mobileMenu.classList.remove("flex");
      }, 300);
    });
  }

  // ---- Hire Me Button ----
  // Mengambil referensi elemen modal
  const thankYouModal = document.getElementById("thank-you-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const hireMeBtn = document.getElementById("hire-me-btn");
  const goToContactBtn = document.getElementById("go-to-contact-btn");

  function showModal() {
    thankYouModal.classList.remove("hidden");
    thankYouModal.classList.add("flex");
  }

  function hideModal() {
    thankYouModal.classList.remove("flex");
    thankYouModal.classList.add("hidden");
  }

  if (hireMeBtn) {
    hireMeBtn.addEventListener("click", (event) => {
      event.preventDefault(); // Mencegah perilaku default jika ada href
      showModal();
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      hideModal();
    });
  }

  if (thankYouModal) {
    thankYouModal.addEventListener("click", (event) => {
      if (event.target === thankYouModal) {
        hideModal();
      }
    });
  }

  // Event listener untuk tombol "Lihat Kontak" di dalam modal
  if (goToContactBtn) {
    goToContactBtn.addEventListener("click", (event) => {
      event.preventDefault(); // Mencegah default anchor link behavior
      hideModal(); // Sembunyikan modal
      // Gulir ke bagian kontak
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // Opsional: Menutup modal dengan tombol Escape
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      thankYouModal &&
      !thankYouModal.classList.contains("hidden")
    ) {
      hideModal();
    }
  });

  // ---- Universal Slider Functionality ----
  const sliderContainers = document.querySelectorAll(".slider-container");

  sliderContainers.forEach((container) => {
    const slider = container.querySelector(".slider");
    const slides = container.querySelectorAll(".slide");
    const prevBtn = container.querySelector(".prev-btn");
    const nextBtn = container.querySelector(".next-btn");

    if (!slider || !slides.length || !prevBtn || !nextBtn) {
      console.warn("Slider elements not found in container:", container);
      return; // Skip if essential elements are missing
    }

    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
      if (index >= slides.length) {
        currentSlide = 0;
      } else if (index < 0) {
        currentSlide = slides.length - 1;
      } else {
        currentSlide = index;
      }
      // Mengatur posisi slider menggunakan transform
      slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    function nextSlide() {
      showSlide(currentSlide + 1);
    }

    function prevSlide() {
      showSlide(currentSlide - 1);
    }

    // Event listeners untuk tombol navigasi
    prevBtn.addEventListener("click", prevSlide);
    nextBtn.addEventListener("click", nextSlide);

    // Fungsi Autoplay (opsional)
    function startAutoplay() {
      stopAutoplay(); // Pastikan tidak ada interval ganda
      slideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
      clearInterval(slideInterval);
    }

    startAutoplay(); // Memulai autoplay saat slider dimuat

    container.addEventListener("mouseenter", stopAutoplay);
    container.addEventListener("mouseleave", startAutoplay);

    showSlide(currentSlide); // Tampilkan slide pertama
  });

  // ---- Smooth Scrolling for Navigation ----
  // Menggunakan delegation untuk navbar link agar lebih efisien dan kompatibel dengan header dinamis
  const headerNav = document.querySelector("header nav ul"); // Asumsi ul ada di dalam nav
  if (headerNav) {
    // Pastikan elemen navigasi ada
    headerNav.addEventListener("click", function (e) {
      const anchor = e.target.closest("a"); // Cari <a> terdekat dari event target
      if (anchor && anchor.getAttribute("href").startsWith("#")) {
        e.preventDefault();

        const targetId = anchor.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const header = document.querySelector("header");
          const headerOffset = header ? header.offsetHeight : 0; // Pastikan header ada
          const elementPosition =
            targetElement.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - headerOffset - 20;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });

          // Tutup mobile menu setelah klik link (jika sedang terbuka)
          if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
            mobileMenu.classList.add("-translate-x-full");
            mobileMenu.classList.remove("translate-x-0");
            setTimeout(() => {
              mobileMenu.classList.add("hidden");
            }, 300);
          }
        }
      }
    });
  }

  // --- Load Modal from external HTML (pindahkan dari DCL kedua) ---
  // Pastikan #modal-container ada di index.html jika ingin menggunakan ini
  const modalContainer = document.getElementById("modal-container");
  if (modalContainer) {
    fetch("./components/modal.html")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((data) => {
        modalContainer.innerHTML = data;
        // Penting: Setelah modal dimuat, inisialisasi ulang event listener untuk tombol-tombol di dalam modal
        // Karena elemen modal baru ditambahkan ke DOM setelah fetch
        const newCloseModalBtn = document.getElementById("close-modal-btn");
        const newGoToContactBtn = document.getElementById("go-to-contact-btn");
        const newThankYouModal = document.getElementById("thank-you-modal");

        if (newCloseModalBtn) {
          newCloseModalBtn.addEventListener("click", () => {
            hideModal();
          });
        }
        if (newGoToContactBtn) {
          newGoToContactBtn.addEventListener("click", (event) => {
            event.preventDefault();
            hideModal();
            const contactSection = document.getElementById("contact");
            if (contactSection) {
              contactSection.scrollIntoView({ behavior: "smooth" });
            }
          });
        }
        if (newThankYouModal) {
          newThankYouModal.addEventListener("click", (event) => {
            if (event.target === newThankYouModal) {
              hideModal();
            }
          });
        }
      })
      .catch((error) => {
        console.error("Error loading modal.html:", error);
      });
  }
}); // Penutup dari DOMContentLoaded utama
