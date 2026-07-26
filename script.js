/* =========================================================
   PENGATURAN — ubah bagian ini sesuai kebutuhanmu
========================================================= */
const CONFIG = {
  weddingDate: "2026-12-12T08:00:00", // format: YYYY-MM-DDTHH:MM:SS
  whatsappNumber: "6281234567890",     // nomor WA tujuan RSVP (format 62xxxxxxxxxx, tanpa + atau 0 di depan)
};

/* =========================================================
   1. NAMA TAMU DARI URL (?to=Nama)
   Contoh link: https://namakamu.github.io/undangan/?to=Syifa
========================================================= */
const params = new URLSearchParams(window.location.search);
const guestName = params.get("to") ? decodeURIComponent(params.get("to")).replace(/\+/g, " ") : "Tamu Undangan";
document.getElementById("guestNameCover").innerText = guestName;

/* =========================================================
   2. BUKA UNDANGAN
========================================================= */
const openBtn = document.getElementById("openBtn");
const cover = document.getElementById("cover");
const content = document.getElementById("content");
const bgm = document.getElementById("bgm");

openBtn.addEventListener("click", () => {
  content.hidden = false;
  cover.style.transition = "opacity .6s ease";
  cover.style.opacity = "0";
  setTimeout(() => { cover.style.display = "none"; }, 600);
  document.body.style.overflow = "auto";
  bgm.play().catch(() => {}); // sebagian browser butuh interaksi user dulu; klik ini sudah cukup
});

/* Musik on/off */
const musicToggle = document.getElementById("musicToggle");
musicToggle.addEventListener("click", () => {
  if (bgm.paused) { bgm.play(); musicToggle.textContent = "♫"; }
  else { bgm.pause(); musicToggle.textContent = "♪"; }
});

/* =========================================================
   3. COUNTDOWN
========================================================= */
const target = new Date(CONFIG.weddingDate).getTime();

function updateCountdown() {
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    document.getElementById("cd-days").textContent = "00";
    document.getElementById("cd-hours").textContent = "00";
    document.getElementById("cd-mins").textContent = "00";
    document.getElementById("cd-secs").textContent = "00";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  document.getElementById("cd-days").textContent = String(days).padStart(2, "0");
  document.getElementById("cd-hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("cd-mins").textContent = String(mins).padStart(2, "0");
  document.getElementById("cd-secs").textContent = String(secs).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* =========================================================
   4. RSVP -> KIRIM VIA WHATSAPP
========================================================= */
const rsvpForm = document.getElementById("rsvpForm");
rsvpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("rsvpName").value.trim();
  const status = document.getElementById("rsvpStatus").value;
  const message = document.getElementById("rsvpMessage").value.trim();

  const text = `Halo, saya ${name}.\nKonfirmasi kehadiran: ${status}.\nUcapan & doa: ${message || "-"}`;
  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
});

/* Isi otomatis nama di form RSVP dari nama tamu di URL */
if (guestName !== "Tamu Undangan") {
  const rsvpNameInput = document.getElementById("rsvpName");
  if (rsvpNameInput) rsvpNameInput.value = guestName;
}

/* =========================================================
   5. SALIN NOMOR REAdriING
========================================================= */
document.querySelectorAll(".btn-copy").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-copy-target");
    const text = document.getElementById(targetId).textContent;
    navigator.clipboard.writeText(text).then(() => {
      const original = btn.textContent;
      btn.textContent = "Tersalin!";
      setTimeout(() => { btn.textContent = original; }, 1500);
    });
  });
});
