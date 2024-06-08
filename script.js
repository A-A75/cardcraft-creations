document.addEventListener("DOMContentLoaded", function() {
    // Select the forms
    let contactForm = document.querySelector("#contact form");
    let orderForm = document.querySelector("#order form");
    
    // Function to display a custom message
    function displayMessage(message) {
        // Create a message element
        let messageElement = document.createElement("div");
        messageElement.textContent = message;
        messageElement.classList.add("message");
        
        // Append the message to the body
        document.body.appendChild(messageElement);
        
        // Remove the message after 5 seconds
        setTimeout(function() {
            messageElement.remove();
        }, 5000);
    }
    
    // Function to handle form submission
    function handleFormSubmit(form) {
        form.addEventListener("submit", function(event) {
            event.preventDefault();
            
            // Get the form data
            let formData = new FormData(form);
            
            // Validate form fields
            if (!formData.get("name") || !formData.get("email")) {
                displayMessage("Please fill out all required fields.");
                return;
            }
            
            // Submit the form data
            fetch(form.action, {
                method: form.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    displayMessage(data.message);
                    form.reset();
                } else {
                    displayMessage("Oops! Something went wrong. Please try again later.");
                }
            })
            .catch(error => {
                displayMessage("Oops! Something went wrong. Please try again later.");
            });
        });
    }
    
    // Handle contact form submission
    handleFormSubmit(contactForm);
    
    // Handle order form submission
    handleFormSubmit(orderForm);
});
{
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
