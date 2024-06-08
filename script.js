// Wait for the DOM to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", function() {
    // Select the form element
    let form = document.querySelector("form");
    
    // Add an event listener for the form submission
    form.addEventListener("submit", function(event) {
        // Get the values of the input fields and trim any extra whitespace
        let name = document.getElementById("name").value.trim();
        let email = document.getElementById("email").value.trim();
        let message = document.getElementById("message").value.trim();

        // Check if any of the fields are empty
        if (name === "" || email === "" || message === "") {
            // If any field is empty, show an alert and prevent the form from submitting
            alert("Please fill out all fields.");
            event.preventDefault();
        } else {
            // If all fields are filled, show a success alert
            alert("Your message has been sent successfully!");
        }
    });
});
