// Memastikan DOM sudah dimuat sebelum menjalankan script
document.addEventListener("DOMContentLoaded", () => {
    // ---- Dynamic Text (Typing Effect) ----
    const dynamicText = document.getElementById("dynamic-text");
    const roles = [
        "Backend Developer",
        "Junior Programmer",
        "Web Developer",
        "Mobile Developer"
    ];
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

    typeAndDelete(); // Memulai efek typing saat halaman dimuat

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
        if (event.key === "Escape" && !thankYouModal.classList.contains("hidden")) {
            hideModal();
        }
    });

    // ---- Universal Slider Functionality ----
    const sliderContainers = document.querySelectorAll('.slider-container');

    sliderContainers.forEach(container => {
        const slider = container.querySelector('.slider');
        const slides = container.querySelectorAll('.slide');
        const prevBtn = container.querySelector('.prev-btn');
        const nextBtn = container.querySelector('.next-btn');

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
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);

        // Fungsi Autoplay (opsional)
        function startAutoplay() {
            slideInterval = setInterval(nextSlide, 5000);
        }

        function stopAutoplay() {
            clearInterval(slideInterval);
        }

        startAutoplay();

        container.addEventListener('mouseenter', stopAutoplay);
        container.addEventListener('mouseleave', startAutoplay);
        
        showSlide(currentSlide);
    });

    // ---- Smooth Scrolling for Navigation ----
    document.querySelectorAll('header nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerOffset = document.querySelector('header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerOffset - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
});