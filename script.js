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
   0. FALLBACK FOTO — kalau foto belum diupload, tampilkan
   kotak placeholder rapi (bukan ikon "gambar rusak" browser)
========================================================= */
const FALLBACK_IMG = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22400%22%20height%3D%22400%22%20viewBox%3D%220%200%20400%20400%22%3E%3Crect%20width%3D%22400%22%20height%3D%22400%22%20fill%3D%22%23EAD9C4%22/%3E%3Crect%20x%3D%2210%22%20y%3D%2210%22%20width%3D%22380%22%20height%3D%22380%22%20fill%3D%22none%22%20stroke%3D%22%23C9A15E%22%20stroke-width%3D%222%22%20stroke-dasharray%3D%226%206%22/%3E%3Cg%20transform%3D%22translate%28200%2C170%29%22%3E%3Crect%20x%3D%22-45%22%20y%3D%22-30%22%20width%3D%2290%22%20height%3D%2265%22%20rx%3D%228%22%20fill%3D%22none%22%20stroke%3D%22%2316224A%22%20stroke-width%3D%225%22/%3E%3Ccircle%20cx%3D%220%22%20cy%3D%222%22%20r%3D%2220%22%20fill%3D%22none%22%20stroke%3D%22%2316224A%22%20stroke-width%3D%225%22/%3E%3Crect%20x%3D%22-15%22%20y%3D%22-42%22%20width%3D%2230%22%20height%3D%2214%22%20rx%3D%223%22%20fill%3D%22%2316224A%22/%3E%3C/g%3E%3Ctext%20x%3D%22200%22%20y%3D%22270%22%20text-anchor%3D%22middle%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2220%22%20fill%3D%22%2316224A%22%3EFoto%20belum%20diupload%3C/text%3E%3C/svg%3E";

function handleImgFallback(img) {
  function setFallback() {
    if (img.src !== FALLBACK_IMG) img.src = FALLBACK_IMG;
  }
  img.addEventListener("error", setFallback);
  // cek foto yang sudah gagal load duluan sebelum listener ini dipasang
  if (img.complete && img.naturalWidth === 0) setFallback();
}
document.querySelectorAll("img").forEach(handleImgFallback);

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
   4. GALERI -> ZOOM FOTO (muncul hanya saat foto galeri diklik)
========================================================= */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

function openLightbox(img) {
  lightboxImg.src = img.currentSrc || img.src;
  lightboxImg.alt = img.alt;
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImg.src = "";
  document.body.style.overflow = "auto";
}

document.querySelectorAll(".gallery .g-item").forEach((img) => {
  img.addEventListener("click", () => openLightbox(img));
});

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !lightbox.hidden) closeLightbox(); });

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
