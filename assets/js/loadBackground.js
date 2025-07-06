// js/loadBackground.js

document.addEventListener('DOMContentLoaded', function() {
    fetch('background.html') // Sesuaikan path jika background.html ada di sub-folder, misal: 'includes/background.html'
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('background-container').innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading background.html:', error);
            // Anda bisa menampilkan pesan error di sini jika perlu
        });
});