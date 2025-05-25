// Memastikan DOM sudah dimuat sebelum menjalankan script
document.addEventListener("DOMContentLoaded", () => {
    // ---- Dynamic Text (Typing Effect) ----
    const dynamicText = document.getElementById("dynamic-text");
    const roles = [
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
    document.getElementById("hire-me-btn").addEventListener("click", () => {
        alert("Terima kasih atas minat Anda! Saya akan segera menghubungi Anda.");
    });

    // ---- Universal Slider Functionality ----
    const sliderContainers = document.querySelectorAll('.slider-container');

    sliderContainers.forEach(container => {
        const slider = container.querySelector('.slider'); // Target elemen 'slider' yang berisi gambar-gambar
        const slides = container.querySelectorAll('.slide');
        const prevBtn = container.querySelector('.prev-btn');
        const nextBtn = container.querySelector('.next-btn');

        let currentSlide = 0;
        let slideInterval; // Untuk fitur autoplay

        function showSlide(index) {
            // Logika untuk loop slider (kembali ke awal atau akhir)
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
            slideInterval = setInterval(nextSlide, 5000); // Ganti slide setiap 5 detik
        }

        function stopAutoplay() {
            clearInterval(slideInterval);
        }

        // Mulai autoplay saat halaman dimuat
        startAutoplay();

        // Hentikan autoplay saat mouse di atas slider, mulai lagi saat keluar
        container.addEventListener('mouseenter', stopAutoplay);
        container.addEventListener('mouseleave', startAutoplay);
        
        // Inisialisasi slide pertama saat DOM dimuat
        showSlide(currentSlide);
    });

    // ---- Smooth Scrolling for Navigation ----
    // Menargetkan semua tautan di dalam elemen nav di dalam header
    document.querySelectorAll('header nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Mencegah perilaku default tautan (loncat langsung)

            const targetId = this.getAttribute('href').substring(1); // Ambil ID dari href (misal: "home" dari "#home")
            const targetElement = document.getElementById(targetId); // Dapatkan elemen target

            if (targetElement) {
                // Hitung offset untuk mempertimbangkan tinggi header sticky
                const headerOffset = document.querySelector('header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerOffset - 20; // Tambah sedikit padding di atas section

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth" // Efek scroll mulus
                });
            }
        });
    });
});