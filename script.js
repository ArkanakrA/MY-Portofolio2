const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwc-4xoRM6mluqCbQ7qriMkc40U1soZR1vciVCXX96JJXK4vuXnOXHHY-aGYvIfQEVj/exec";

// Mengambil elemen sesuai ID pada HTML
const form = document.getElementById("guestbookForm");
const nameInput = document.getElementById("guestName");
const messageInput = document.getElementById("guestMessage");
const list = document.getElementById("guestList");

// Elemen pesan status dinamis
const formMsg = document.createElement("p");
formMsg.style.marginTop = "10px";
formMsg.style.fontSize = "0.9rem";
form.appendChild(formMsg);

function escapeHTML(str) {
    if (!str) return "";
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

function renderList(data) {
    list.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
        list.innerHTML = '<li class="guestbook__item"><p class="guestbook__message">Belum ada pesan. Jadilah yang pertama!</p></li>';
        return;
    }

    // Urutkan dari yang terbaru (reverse)
    data.slice().reverse().forEach((entry) => {
        const li = document.createElement("li");
        li.className = "guestbook__item";
        li.innerHTML = `
            <div class="guestbook__item-header" style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                <span class="guestbook__author" style="font-weight: 800; font-size: 1.15rem; color: #000;">${escapeHTML(entry.nama)}</span>
                <span style="color: #777;"></span>
                <span class="guestbook__date" style="font-size: 0.88rem; color: #666; font-style: italic;">${escapeHTML(entry.tanggal)}</span>
            </div>
            <p class="guestbook__message" style="margin: 0; font-size: 1rem; color: #333;">${escapeHTML(entry.komentar)}</p>
        `;
        list.appendChild(li);
    });
}

function muatData() {
    list.innerHTML = '<li class="guestbook__item"><p class="guestbook__message">Memuat pesan...</p></li>';
    
    fetch(SCRIPT_URL)
        .then((res) => {
            if (!res.ok) throw new Error("Gagal mengambil data");
            return res.json();
        })
        .then((data) => renderList(data))
        .catch((err) => {
            console.error("Error muatData:", err);
            list.innerHTML = '<li class="guestbook__item"><p class="guestbook__message">Gagal memuat pesan. Silakan coba lagi nanti.</p></li>';
        });
}

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const nama = nameInput.value.trim();
    const komentar = messageInput.value.trim();

    if (!nama || !komentar) {
        formMsg.textContent = "Mohon isi semua kolom.";
        formMsg.style.color = "red";
        return;
    }

    formMsg.textContent = "Mengirim pesan...";
    formMsg.style.color = "inherit";
    if (submitBtn) submitBtn.disabled = true;

    fetch(SCRIPT_URL, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify({ nama, komentar })
    })
        .then((res) => {
            if (!res.ok) throw new Error("Gagal mengirim data");
            return res.json();
        })
        .then(() => {
            form.reset();
            formMsg.textContent = "Terima kasih, pesan kamu sudah tersimpan! ✅";
            formMsg.style.color = "green";
            setTimeout(() => (formMsg.textContent = ""), 4000);
            muatData();
        })
        .catch((err) => {
            console.error("Error submit form:", err);
            formMsg.textContent = "Gagal mengirim. Coba lagi ya.";
            formMsg.style.color = "red";
        })
        .finally(() => {
            if (submitBtn) submitBtn.disabled = false;
        });
});

// Muat data saat halaman pertama kali dibuka
muatData();
