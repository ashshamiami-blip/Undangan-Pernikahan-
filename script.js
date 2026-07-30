/* =========================================================
   PENGATURAN — ubah bagian ini sesuai kebutuhanmu
========================================================= */
const CONFIG = {
  weddingDate: "2026-12-12T08:00:00", // format: YYYY-MM-DDTHH:MM:SS

  // RSVP dikirim ke Formspree (layanan gratis) supaya konfirmasi tetap
  // di dalam website, tidak pindah ke WhatsApp.
  // Cara dapatkan endpoint ini: daftar gratis di https://formspree.io
  // -> Create Form -> nanti dapat link seperti https://formspree.io/f/xxxxabcd
  // -> ganti nilai di bawah ini dengan link tersebut.
  formspreeEndpoint: "https://formspree.io/f/GANTI_DENGAN_ID_FORM_KAMU",
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
   4. GALERI -> LIGHTBOX (klik foto untuk zoom)
========================================================= */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

document.querySelectorAll(".gallery .g-item").forEach((img) => {
  img.addEventListener("click", () => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.hidden = false;
  });
});

function closeLightbox() { lightbox.hidden = true; lightboxImg.src = ""; }
lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

/* =========================================================
   5. RSVP -> KIRIM LANGSUNG DARI WEBSITE (via Formspree)
========================================================= */
const rsvpForm = document.getElementById("rsvpForm");
const rsvpSubmitBtn = document.getElementById("rsvpSubmitBtn");
const rsvpStatusMsg = document.getElementById("rsvpStatusMsg");

rsvpForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("rsvpName").value.trim();
  const status = document.getElementById("rsvpStatus").value;
  const message = document.getElementById("rsvpMessage").value.trim();

  rsvpSubmitBtn.disabled = true;
  rsvpSubmitBtn.textContent = "Mengirim...";
  rsvpStatusMsg.hidden = true;

  try {
    const response = await fetch(CONFIG.formspreeEndpoint, {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ nama: name, kehadiran: status, ucapan: message || "-" }),
    });

    if (response.ok) {
      rsvpStatusMsg.textContent = "Terima kasih! Konfirmasi kehadiran kamu sudah terkirim.";
      rsvpStatusMsg.className = "rsvp-status-msg success";
      rsvpStatusMsg.hidden = false;
      rsvpForm.reset();
      if (guestName !== "Tamu Undangan") document.getElementById("rsvpName").value = guestName;
      rsvpSubmitBtn.textContent = "Kirim Konfirmasi";
    } else {
      throw new Error("Gagal mengirim");
    }
  } catch (err) {
    rsvpStatusMsg.textContent = "Maaf, konfirmasi gagal terkirim. Coba lagi sebentar lagi ya.";
    rsvpStatusMsg.className = "rsvp-status-msg error";
    rsvpStatusMsg.hidden = false;
    rsvpSubmitBtn.textContent = "Kirim Konfirmasi";
  }

  rsvpSubmitBtn.disabled = false;
});

/* Isi otomatis nama di form RSVP dari nama tamu di URL */
if (guestName !== "Tamu Undangan") {
  const rsvpNameInput = document.getElementById("rsvpName");
  if (rsvpNameInput) rsvpNameInput.value = guestName;
}

/* =========================================================
   6. SALIN NOMOR REKENING
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
