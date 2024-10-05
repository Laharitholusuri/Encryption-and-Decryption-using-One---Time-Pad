function encrypt() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
        alert('Please select a file to encrypt.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const plaintext = event.target.result;
        const key = generateRandomKey(plaintext.length);
        const encryptedText = oneTimePadEncrypt(plaintext, key);

        const encryptedBlob = new Blob([encryptedText], { type: 'text/plain' });
        const downloadLink = document.getElementById('downloadLink');
        downloadLink.href = URL.createObjectURL(encryptedBlob);
        downloadLink.download = 'encrypted.txt';
        downloadLink.style.display = 'inline';

        const keyBlob = new Blob([key], { type: 'text/plain' });
        const keyDownloadLink = document.getElementById('keyDownloadLink');
        keyDownloadLink.href = URL.createObjectURL(keyBlob);
        keyDownloadLink.download = 'encryption_key.txt'; // Save key as .txt file
        keyDownloadLink.style.display = 'inline';
    };

    reader.readAsText(file);
}

function decrypt() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
        alert('Please select an encrypted file to decrypt.');
        return;
    }

    const file = fileInput.files[0];
    const keyInput = document.createElement('input');
    keyInput.type = 'file';
    keyInput.accept = '.txt';
    keyInput.onchange = function() {
        const keyFile = keyInput.files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            const key = event.target.result;
            const readerEncrypted = new FileReader();
            readerEncrypted.onload = function(event) {
                const encryptedText = event.target.result;
                const decryptedText = oneTimePadDecrypt(encryptedText, key);

                const decryptedBlob = new Blob([decryptedText], { type: 'text/plain' });
                const downloadLink = document.getElementById('downloadLink');
                downloadLink.href = URL.createObjectURL(decryptedBlob);
                downloadLink.download = 'decrypted.txt';
                downloadLink.style.display = 'inline';
            };

            readerEncrypted.readAsText(file);
        };

        reader.readAsText(keyFile);
    };
    keyInput.click(); // Open file dialog for the key
}

// Function to generate a random key
function generateRandomKey(length) {
    let key = '';
    for (let i = 0; i < length; i++) {
        key += String.fromCharCode(Math.floor(Math.random() * 256));
    }
    return key;
}

// Function to encrypt using One-Time Pad
function oneTimePadEncrypt(text, key) {
    let encryptedText = '';
    for (let i = 0; i < text.length; i++) {
        encryptedText += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i));
    }
    return encryptedText;
}

// Function to decrypt using One-Time Pad
function oneTimePadDecrypt(encryptedText, key) {
    let decryptedText = '';
    for (let i = 0; i < encryptedText.length; i++) {
        decryptedText += String.fromCharCode(encryptedText.charCodeAt(i) ^ key.charCodeAt(i));
    }
    return decryptedText;
}
