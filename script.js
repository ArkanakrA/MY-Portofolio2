// Ganti URL di bawah ini dengan Web App URL dari Google Apps Script
const scriptURL = 'https://script.google.com/macros/s/AKfycbwOQ_e0QZmubbKnWwGyCMQcjuYvXEGRJiuCZNkoRjp1NKSexhr2E6oR9mIiwMcXG1aM/exec';
const guestbookForm = document.getElementById('guestbookForm');
const guestList = document.getElementById('guestList');

if (guestbookForm) {
    guestbookForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const submitBtn = guestbookForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerText;
        
        // Indikator saat proses pengiriman
        submitBtn.innerText = 'Mengirim...';
        submitBtn.disabled = true;

        const nameInput = document.getElementById('guestName').value;
        const messageInput = document.getElementById('guestMessage').value;

        const payload = {
            name: nameInput,
            message: messageInput
        };

        fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors', // Menghindari isu CORS pada Google Apps Script
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(() => {
            alert('Terima kasih! Pesan Anda telah tersimpan di Google Sheets.');

            // Opsional: Langsung tampilkan pesan di halaman tanpa reload
            if (guestList) {
                const newItem = document.createElement('li');
                newItem.className = 'guestbook__item';
                newItem.innerHTML = `
                    <div class="guestbook__item-header">
                        <span class="guestbook__author">${nameInput}</span>
                        <span class="guestbook__date">Baru saja</span>
                    </div>
                    <p class="guestbook__message">${messageInput}</p>
                `;
                guestList.prepend(newItem);
            }

            guestbookForm.reset();
        })
        .catch(error => {
            console.error('Error!', error);
            alert('Gagal mengirim pesan. Silakan coba lagi.');
        })
        .finally(() => {
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        });
    });
}