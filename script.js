document.addEventListener('DOMContentLoaded', function() {
    const auth = firebase.auth();
    const db = firebase.firestore();
    const storage = firebase.storage();

    const loginForm = document.getElementById('login-form');
    const uploadForm = document.getElementById('upload-form');
    const uploadInput = document.getElementById('upload');
    const descriptionInput = document.getElementById('description');
    const uploadedImagesDiv = document.getElementById('uploaded-images');
    const galleryItemsDiv = document.getElementById('gallery-items');

    // Admin Login
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('admin-email').value;
        const password = document.getElementById('admin-password').value;

        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Logged in
                loginForm.style.display = 'none';
                uploadForm.style.display = 'block';
            })
            .catch((error) => {
                alert(error.message);
            });
    });

    // File Upload
    uploadForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const file = uploadInput.files[0];
        const description = descriptionInput.value;
        if (file && description) {
            const storageRef = storage.ref('uploads/' + file.name);
            storageRef.put(file).then(() => {
                storageRef.getDownloadURL().then((url) => {
                    db.collection('images').add({
                        url: url,
                        description: description
                    }).then(() => {
                        alert('Upload successful');
                        displayImages();
                        uploadForm.reset();
                    }).catch((error) => {
                        alert('Error saving to database: ' + error.message);
                    });
                }).catch((error) => {
                    alert('Error getting download URL: ' + error.message);
                });
            }).catch((error) => {
                alert('Error uploading file: ' + error.message);
            });
        } else {
            alert('Please select a file and provide a description');
        }
    });

    // Display Images
    function displayImages() {
        uploadedImagesDiv.innerHTML = '';
        db.collection('images').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const imageData = doc.data();
                const imgElement = document.createElement('img');
                imgElement.src = imageData.url;
                imgElement.alt = imageData.description;
                imgElement.classList.add('responsive-img');
                uploadedImagesDiv.appendChild(imgElement);
            });
        }).catch((error) => {
            alert('Error loading images: ' + error.message);
        });

        galleryItemsDiv.innerHTML = '';
        db.collection('images').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const imageData = doc.data();
                const galleryItem = document.createElement('div');
                galleryItem.innerHTML = `
                    <img src="${imageData.url}" alt="${imageData.description}" class="responsive-img">
                    <p>${imageData.description}</p>
                `;
                galleryItemsDiv.appendChild(galleryItem);
            });
        }).catch((error) => {
            alert('Error loading gallery items: ' + error.message);
        });
    }

    displayImages();
});
