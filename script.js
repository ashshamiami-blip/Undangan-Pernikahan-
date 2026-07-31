/* =========================================================
   PENGATURAN — ubah bagian ini sesuai kebutuhanmu
========================================================= */
const CONFIG = {
  weddingDate: "2026-12-12T08:00:00", // format: YYYY-MM-DDTHH:MM:SS

  // Formspree (Opsional untuk notifikasi email)
  formspreeEndpoint: "https://formspree.io/f/xnjeyvjk",
};

/* =========================================================
   FIREBASE INITIALIZATION (Realtime Database)
========================================================= */
const firebaseConfig = {
  databaseURL: "https://undangan-p-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

/* =========================================================
   0. FALLBACK FOTO — kalau foto belum diupload
========================================================= */
const FALLBACK_IMG = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22400%22%20height%3D%22400%22%20viewBox%3D%220%200%20400%20400%22%3E%3Crect%20width%3D%22400%22%20height%3D%22400%22%20fill%3D%22%23EAD9C4%22/%3E%3Crect%20x%3D%2210%22%20y%3D%2210%22%20width%3D%22380%22%20height%3D%22380%22%20fill%3D%22none%22%20stroke%3D%22%23C9A15E%22%20stroke-width%3D%222%22%20stroke-dasharray%3D%226%206%22/%3E%3Cg%20transform%3D%22translate%28200%2C170%29%22%3E%3Crect%20x%3D%22-45%22%20y%3D%22-30%22%20width%3D%2290%22%20height%3D%2265%22%20rx%3D%228%22%20fill%3D%22none%22%20stroke%3D%22%2316224A%22%20stroke-width%3D%225%22/%3E%3Ccircle%20cx%3D%220%22%20cy%3D%222%22%20r%3D%2220%22%20fill%3D%22none%22%20stroke%3D%22%2316224A%22%20stroke-width%3D%225%22/%3E%3Crect%20x%3D%22-15%22%20y%3D%22-42%22%20width%3D%2230%22%20height%3D%2214%22%20rx%3D%223%22%20fill%3D%22%2316224A%22/%3E%3C/g%3E%3Ctext%20x%3D%22200%22%20y%3D%22270%22%20text-anchor%3D%22middle%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2220%22%20fill%3D%22%2316224A%22%3EFoto%20belum%20diupload%3C/text%3E%3C/svg%3E";

function handleImgFallback(img) {
  function setFallback() {
    if (img.src !== FALLBACK_IMG) img.src = FALLBACK_IMG;
  }
  img.addEventListener("error", setFallback);
  if (img.complete && img.naturalWidth === 0) setFallback();
}
document.querySelectorAll("img").forEach(handleImgFallback);

/* =========================================================
   1. NAMA TAMU DARI URL (?to=Nama)
========================================================= */
const params = new URLSearchParams(window.location.search);
const guestName = params.get("to") ? decodeURIComponent(params.get("to")).replace(/\+/g, " ") : "";

// Tampilkan nama di Cover jika ada di URL
const guestNameCover = document.getElementById("guestNameCover");
if (guestNameCover) {
  guestNameCover.innerText = guestName || "Tamu Undangan";
}

/* =========================================================
   ISI OTOMATIS & KUNCI INPUT NAMA RSVP
========================================================= */
const rsvpNameInput = document.getElementById("rsvpName");
if (rsvpNameInput && guestName) {
  rsvpNameInput.value = guestName; // Isi nama otomatis
  rsvpNameInput.readOnly = true;  // Kunci agar tidak bisa diketik/diubah
  rsvpNameInput.style.backgroundColor = "#f0f0f0"; // (Opsional) beri warna agak abu-abu tanda terkunci
  rsvpNameInput.style.cursor = "not-allowed";
}
   2. BUKA UNDANGAN & MUSIK
========================================================= */
const openBtn = document.getElementById("openBtn");
const cover = document.getElementById("cover");
const content = document.getElementById("content");
const bgm = document.getElementById("bgm");

if (openBtn) {
  openBtn.addEventListener("click", () => {
    content.hidden = false;
    cover.style.transition = "opacity .6s ease";
    cover.style.opacity = "0";
    setTimeout(() => { cover.style.display = "none"; }, 600);
    document.body.style.overflow = "auto";
    if (bgm) bgm.play().catch(() => {});
  });
}

const musicToggle = document.getElementById("musicToggle");
if (musicToggle && bgm) {
  musicToggle.addEventListener("click", () => {
    if (bgm.paused) { bgm.play(); musicToggle.textContent = "♫"; }
    else { bgm.pause(); musicToggle.textContent = "♪"; }
  });
}

/* =========================================================
   3. COUNTDOWN
========================================================= */
const target = new Date(CONFIG.weddingDate).getTime();

function updateCountdown() {
  const now = Date.now();
  const diff = target - now;

  const cdDays = document.getElementById("cd-days");
  const cdHours = document.getElementById("cd-hours");
  const cdMins = document.getElementById("cd-mins");
  const cdSecs = document.getElementById("cd-secs");

  if (!cdDays) return;

  if (diff <= 0) {
    cdDays.textContent = "00";
    cdHours.textContent = "00";
    cdMins.textContent = "00";
    cdSecs.textContent = "00";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  cdDays.textContent = String(days).padStart(2, "0");
  cdHours.textContent = String(hours).padStart(2, "0");
  cdMins.textContent = String(mins).padStart(2, "0");
  cdSecs.textContent = String(secs).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* =========================================================
   4. GALERI -> ZOOM FOTO
========================================================= */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

function openLightbox(img) {
  if (!lightboxImg || !lightbox) return;
  lightboxImg.src = img.currentSrc || img.src;
  lightboxImg.alt = img.alt;
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.hidden = true;
  if (lightboxImg) lightboxImg.src = "";
  document.body.style.overflow = "auto";
}

document.querySelectorAll(".gallery .g-item").forEach((img) => {
  img.addEventListener("click", () => openLightbox(img));
});

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
if (lightbox) {
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
}
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && lightbox && !lightbox.hidden) closeLightbox(); });

/* =========================================================
   5. RSVP -> KIRIM DAN TAMPILKAN DI WEBSITE (FIREBASE)
========================================================= */
const rsvpForm = document.getElementById("rsvpForm");
const rsvpSubmitBtn = document.getElementById("rsvpSubmitBtn");
const rsvpStatusMsg = document.getElementById("rsvpStatusMsg");
const rsvpListContainer = document.getElementById("rsvpListContainer");

if (rsvpForm) {
  rsvpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("rsvpName").value.trim();
    const status = document.getElementById("rsvpStatus").value;
    const message = document.getElementById("rsvpMessage").value.trim();

    rsvpSubmitBtn.disabled = true;
    rsvpSubmitBtn.textContent = "Mengirim...";
    rsvpStatusMsg.hidden = true;

    try {
      // 1. Simpan ke Firebase Realtime Database
      const newRsvpRef = database.ref("responses").push();
      await newRsvpRef.set({
        nama: name,
        kehadiran: status,
        ucapan: message || "-",
        timestamp: Date.now()
      });

      // 2. Opsional: Kirim juga ke Formspree (email)
      fetch(CONFIG.formspreeEndpoint, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ nama: name, kehadiran: status, ucapan: message || "-" }),
      }).catch(() => {});

      // Berhasil
      rsvpStatusMsg.textContent = "Terima kasih! Konfirmasi kehadiran kamu sudah terkirim.";
      rsvpStatusMsg.className = "rsvp-status-msg success";
      rsvpStatusMsg.hidden = false;
      rsvpForm.reset();

      // Kembalikan nama dari URL dan kunci lagi (jika ada nama dari URL)
      if (hasCustomGuest && rsvpNameInput) {
        rsvpNameInput.value = guestName;
        rsvpNameInput.readOnly = true;
      }
      // ------------------------------------

      if (guestName !== "Tamu Undangan") {
        document.getElementById("rsvpName").value = guestName;
      }
    } catch (err) {
      rsvpStatusMsg.textContent = "Maaf, konfirmasi gagal terkirim. Coba lagi nanti.";
      rsvpStatusMsg.className = "rsvp-status-msg error";
      rsvpStatusMsg.hidden = false;
    }

    rsvpSubmitBtn.disabled = false;
    rsvpSubmitBtn.textContent = "Kirim Konfirmasi";
  });
}

// Isi otomatis nama di form RSVP dari URL
if (guestName !== "Tamu Undangan") {
  const rsvpNameInput = document.getElementById("rsvpName");
  if (rsvpNameInput) rsvpNameInput.value = guestName;
}

// Menampilkan daftar komentar/kehadiran secara realtime
function loadRsvpData() {
  if (!rsvpListContainer) return;

  database.ref("responses").on("value", (snapshot) => {
    rsvpListContainer.innerHTML = "";
    const data = snapshot.val();

    if (!data) {
      rsvpListContainer.innerHTML = "<p style='text-align:center; opacity:0.7; margin-top:15px;'>Belum ada ucapan atau konfirmasi.</p>";
      return;
    }

    // Urutkan dari ucapan terbaru
    const rsvpArray = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);

    rsvpArray.forEach((item) => {
      const card = document.createElement("div");
      card.className = "rsvp-card";

      const isHadir = item.kehadiran === "Hadir" || item.kehadiran === "Insyaallah Hadir";
      const badgeClass = isHadir ? "badge-success" : "badge-danger";

      card.innerHTML = `
        <div class="rsvp-card-header">
          <strong>${escapeHTML(item.nama)}</strong>
          <span class="rsvp-badge ${badgeClass}">${escapeHTML(item.kehadiran)}</span>
        </div>
        <p class="rsvp-card-msg">${escapeHTML(item.ucapan)}</p>
      `;

      rsvpListContainer.appendChild(card);
    });
  });
}

function escapeHTML(str) {
  return String(str).replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// Panggil fungsi untuk memuat ucapan saat halaman dibuka
loadRsvpData();

/* =========================================================
   6. SALIN NOMOR REKENING
========================================================= */
document.querySelectorAll(".btn-copy").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-copy-target");
    const targetElem = document.getElementById(targetId);
    if (!targetElem) return;

    const text = targetElem.textContent;
    navigator.clipboard.writeText(text).then(() => {
      const original = btn.textContent;
      btn.textContent = "Tersalin!";
      setTimeout(() => { btn.textContent = original; }, 1500);
    });
  });
});
