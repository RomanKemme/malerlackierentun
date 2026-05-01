// ===== WARENKORB =====
let warenkorb = [];

const panel         = document.getElementById("warenkorb-panel");
const overlay       = document.getElementById("overlay");
const anzahlAnzeige = document.getElementById("anzahl");
const panelInhalt   = document.getElementById("panel-inhalt");
const gesamtPreis   = document.getElementById("gesamt-preis");
const warenkorbIcon = document.getElementById("warenkorb-icon");

warenkorbIcon.addEventListener("click", () => panelToggle(true));
document.getElementById("schliessen-btn").addEventListener("click", () => panelToggle(false));
overlay.addEventListener("click", () => panelToggle(false));

function panelToggle(offen) {
  panel.classList.toggle("offen", offen);
  overlay.classList.toggle("offen", offen);
}

function warenkorbAktualisieren() {
  anzahlAnzeige.textContent = warenkorb.length;
  panelInhalt.innerHTML = "";

  if (warenkorb.length === 0) {
    panelInhalt.innerHTML = '<p class="leer-text">noch nix drin.</p>';
    gesamtPreis.textContent = "0,00 €";
    return;
  }

  warenkorb.forEach((produkt, index) => {
    const item = document.createElement("div");
    item.classList.add("warenkorb-item");
    item.innerHTML = `
      <span class="item-name">${produkt.name}</span>
      <span class="item-preis">${produkt.preis.toFixed(2).replace(".", ",")} €</span>
      <button class="item-remove" data-index="${index}">✕</button>
    `;
    panelInhalt.appendChild(item);
  });

  document.querySelectorAll(".item-remove").forEach(btn => {
    btn.addEventListener("click", function() {
      warenkorb.splice(parseInt(this.dataset.index), 1);
      warenkorbAktualisieren();
    });
  });

  const gesamt = warenkorb.reduce((sum, p) => sum + p.preis, 0);
  gesamtPreis.textContent = gesamt.toFixed(2).replace(".", ",") + " €";
}

// ===== ADD TO BAG =====
document.querySelectorAll(".add-btn").forEach(button => {
  button.addEventListener("click", function() {
    warenkorb.push({ name: this.dataset.name, preis: parseFloat(this.dataset.preis) });
    warenkorbAktualisieren();
    const karte = this.closest(".karte");
    karte.classList.add("added");
    setTimeout(() => karte.classList.remove("added"), 400);
    panelToggle(true);
  });
});

// ===== HERO VIDEO WECHSEL =====
const heroVideo = document.getElementById("hero-video");
const dots = document.querySelectorAll(".dot");
let currentDot = 0;

// Automatisch nach 12 Sekunden wechseln
let autoSwitch = setInterval(() => switchVideo((currentDot + 1) % dots.length), 12000);

function switchVideo(index) {
  const src = dots[index].dataset.video;
  dots[currentDot].classList.remove("active");
  currentDot = index;
  dots[currentDot].classList.add("active");

  heroVideo.style.opacity = "0";
  heroVideo.style.transition = "opacity 0.6s ease";

  setTimeout(() => {
    heroVideo.src = src;
    heroVideo.play();
    heroVideo.style.opacity = "1";
  }, 600);
}

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    clearInterval(autoSwitch);
    switchVideo(index);
    autoSwitch = setInterval(() => switchVideo((currentDot + 1) % dots.length), 12000);
  });
});

// ===== BEHIND VIDEO =====
const behindVideo = document.getElementById("behind-video");
const playBtn     = document.getElementById("play-btn");
const playIcon    = document.getElementById("play-icon");
const tonBtn      = document.getElementById("ton-btn");
let muted = true;

// Autoplay wenn in Sichtweite
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      behindVideo.play();
      playBtn.classList.add("playing");
      playIcon.textContent = "⏸";
    } else {
      behindVideo.pause();
      playBtn.classList.remove("playing");
      playIcon.textContent = "▶";
    }
  });
}, { threshold: 0.4 });

observer.observe(behindVideo);

// Play/Pause Button
playBtn.addEventListener("click", () => {
  if (behindVideo.paused) {
    behindVideo.play();
    playBtn.classList.add("playing");
    playIcon.textContent = "⏸";
  } else {
    behindVideo.pause();
    playBtn.classList.remove("playing");
    playIcon.textContent = "▶";
  }
});

// Ton Button
tonBtn.addEventListener("click", () => {
  muted = !muted;
  behindVideo.muted = muted;
  tonBtn.textContent = muted ? "🔇" : "🔊";
});