document.addEventListener("DOMContentLoaded", function() {
    const sections = document.querySelectorAll("main section");
    const navLinks = document.querySelectorAll("nav ul li a");

    navLinks.forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const targetId = this.getAttribute("href").substring(1);

            sections.forEach(section => {
                section.style.display = section.id === targetId ? "block" : "none";
            });
        });
    });

    const form = document.querySelector("#login-form");
    form.addEventListener("submit", async function(event) {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const { token } = await response.json();
            localStorage.setItem('authToken', token);
            document.getElementById("login").style.display = "none";
            document.getElementById("upload").style.display = "block";
        } else {
            alert("Invalid login credentials.");
        }
    });

    const uploadForm = document.querySelector("#upload-form");
    uploadForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const formData = new FormData(uploadForm);
        const token = localStorage.getItem('authToken');

        const response = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Authorization': token },
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            alert("File uploaded successfully!");

            const uploadedImages = document.getElementById("uploaded-images");
            const galleryImages = document.getElementById("gallery-images");

            const newImage = document.createElement("div");
            newImage.classList.add("gallery-item");

            const img = document.createElement("img");
            img.src = data.filePath;
            img.alt = data.description;
            img.classList.add("responsive-img");

            const description = document.createElement("p");
            description.textContent = data.description;

            newImage.appendChild(img);
            newImage.appendChild(description);

            uploadedImages.appendChild(newImage.cloneNode(true));
            galleryImages.appendChild(newImage);
        } else {
            alert("Failed to upload file.");
        }
    });
});
