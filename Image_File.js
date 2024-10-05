// Global variable to store the key
let encryptionKey;

// Function to handle encryption
document.getElementById("encryptButton").addEventListener("click", function() {
    const fileInput = document.getElementById("imageInput");
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        // Event listener for when the file is loaded
        reader.onload = function(e) {
            const arrayBuffer = e.target.result;  // Binary data of the image

            // Convert the ArrayBuffer to a byte array
            const byteArray = new Uint8Array(arrayBuffer);

            // Generate a random key of the same length as the image data for encryption
            encryptionKey = new Uint8Array(byteArray.length);
            for (let i = 0; i < encryptionKey.length; i++) {
                encryptionKey[i] = Math.floor(Math.random() * 256);  // Random byte (0-255)
            }

            // XOR the image data with the key for encryption
            const encryptedData = new Uint8Array(byteArray.length);
            for (let i = 0; i < byteArray.length; i++) {
                encryptedData[i] = byteArray[i] ^ encryptionKey[i];
            }

            // Create a Blob from the encrypted data
            const encryptedBlob = new Blob([encryptedData], { type: "application/octet-stream" });

            // Create a download link for the encrypted file
            const downloadLink = document.getElementById("downloadLink");
            downloadLink.href = URL.createObjectURL(encryptedBlob);
            downloadLink.download = "encrypted_image.bin";  // Save as .bin file
            downloadLink.style.display = "block";
            downloadLink.textContent = "Download Encrypted Image";

            // Save the encryption key to a file
            const keyBlob = new Blob([encryptionKey], { type: "application/octet-stream" });
            const keyDownloadLink = document.getElementById("keyDownloadLink");
            keyDownloadLink.href = URL.createObjectURL(keyBlob);
            keyDownloadLink.download = "encryption_key.bin"; // Save key as .bin file
            keyDownloadLink.style.display = "block";
        };

        // Read the image file as an ArrayBuffer (binary data)
        reader.readAsArrayBuffer(file);
    } else {
        alert("Please select an image file.");
    }
});

// Function to handle decryption
document.getElementById("decryptButton").addEventListener("click", function() {
    const fileInput = document.getElementById("encryptedInput");
    const file = fileInput.files[0];

    // Prompt the user to upload the key file for decryption
    const keyInput = document.createElement('input');
    keyInput.type = 'file';
    keyInput.accept = '.bin';
    keyInput.onchange = function() {
        const keyFile = keyInput.files[0];
        if (keyFile) {
            const keyReader = new FileReader();
            keyReader.onload = function(event) {
                // Load the key used for encryption
                encryptionKey = new Uint8Array(event.target.result);

                const reader = new FileReader();
                reader.onload = function(e) {
                    const arrayBuffer = e.target.result;  // Binary data of the encrypted image

                    // Convert the ArrayBuffer to a byte array
                    const byteArray = new Uint8Array(arrayBuffer);

                    // XOR the encrypted data with the key for decryption
                    const decryptedData = new Uint8Array(byteArray.length);
                    for (let i = 0; i < byteArray.length; i++) {
                        decryptedData[i] = byteArray[i] ^ encryptionKey[i];
                    }

                    // Create a Blob from the decrypted data
                    const decryptedBlob = new Blob([decryptedData], { type: "image/jpeg" }); // Change MIME type as needed

                    // Create a download link for the decrypted file
                    const decryptedDownloadLink = document.getElementById("decryptedDownloadLink");
                    decryptedDownloadLink.href = URL.createObjectURL(decryptedBlob);
                    decryptedDownloadLink.download = "decrypted_image.jpg";  // Save as .jpg file
                    decryptedDownloadLink.style.display = "block";
                    decryptedDownloadLink.textContent = "Download Decrypted Image";
                };

                // Read the encrypted image file as an ArrayBuffer (binary data)
                reader.readAsArrayBuffer(file);
            };

            // Read the key file as an ArrayBuffer
            keyReader.readAsArrayBuffer(keyFile);
        } else {
            alert("Please select an encryption key file.");
        }
    };
    keyInput.click(); // Open file dialog for the key
});
