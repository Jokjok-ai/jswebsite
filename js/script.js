// Menambahkan interaktivitas pada tombol "Hire Me"
document.getElementById("hire-me-btn").addEventListener("click", function () {
    alert("Thank you for showing interest! I'll get back to you soon.");
  });
  
  const dynamicText = document.getElementById("dynamic-text");
  const roles = [
      "Junior Programmer", 
      "Web Developer", 
      "Mobile Developer"
  ];
  let currentIndex = 0;
  
  function typeText(text) {
      dynamicText.textContent = ""; // Reset the content of dynamic-text before typing
      let i = 0;
      const interval = setInterval(() => {
          dynamicText.textContent += text.charAt(i);
          i++;
          if (i === text.length) {
              clearInterval(interval);
          }
      }, 250); // Adjust typing speed (250ms per character, slower than before)
  }
  
  function changeText() {
      typeText(roles[currentIndex]);
      currentIndex = (currentIndex + 1) % roles.length; // Loop back to the start
  }
  
  // Start with the first role
  changeText();
   
  // Change text every 6 seconds (after typing animation completes)
  setInterval(changeText, 6000);
  
  let currentSlide = 0;

    function showSlide(index) {
      const slides = document.querySelectorAll('.slide');
      if (index >= slides.length) {
        currentSlide = 0;
      } else if (index < 0) {
        currentSlide = slides.length - 1;
      } else {
        currentSlide = index;
      }
      const slider = document.getElementById('slider');
      slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    function nextSlide() {
      showSlide(currentSlide + 1);
    }

    function prevSlide() {
      showSlide(currentSlide - 1);
    }

    document.addEventListener('DOMContentLoaded', () => {
      showSlide(currentSlide);
    });

  let currentSlide2 = 0;

    function showSlide2(index) {
      const slides2 = document.querySelectorAll('.slide2');
      if (index >= slides2.length) {
        currentSlide2 = 0;
      } else if (index < 0) {
        currentSlide2 = slides2.length - 1;
      } else {
        currentSlide2 = index;
      }
      const slider2 = document.getElementById('slider2');
      slider2.style.transform = `translateX(-${currentSlide2 * 100}%)`;
    }

    function nextSlide2() {
      showSlide2(currentSlide2 + 1);
    }

    function prevSlide2() {
      showSlide2(currentSlide2 - 1);
    }

    document.addEventListener('DOMContentLoaded', () => {
      showSlide2(currentSlide2);
    });