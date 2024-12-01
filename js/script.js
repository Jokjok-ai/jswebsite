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
  