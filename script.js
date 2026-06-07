let balicek = [];
let vybranaKarta = null;
let tazenaKarta = null;

function generuj() {
  balicek = [];

  let zaklady = ["1/2", "1/3", "2/3", "3/4", "4/5"];

  zaklady.forEach(function (z) {
    let casti = z.split("/");
    let a = parseInt(casti[0]);
    let b = parseInt(casti[1]);

    for (let i = 1; i <= 4; i++) {
      balicek.push({
        priklad: (a * i) + "/" + (b * i),
        vysledek: z
      });
    }
  });

  balicek.sort(function () {
    return Math.random() - 0.5;
  });
}

function vytvorKartu(text, vysledek) {
  let karta = document.createElement("div");
  karta.className = "karta";
  karta.innerText = text;
  karta.dataset.v = vysledek;
  karta.draggable = true;

  // ✅ PC drag
  karta.addEventListener("dragstart", function () {
    tazenaKarta = karta;
  });

  // ✅ mobil klik
  karta.addEventListener("click", function () {
    vybranaKarta = karta;
  });

  return karta;
}

function lizniKartu() {
  if (balicek.length === 0) return;

  let k = balicek.pop();

  let zona = document.getElementById("aktualni-karta");
  zona.innerHTML = "";
  zona.appendChild(vytvorKartu(k.priklad, k.vysledek));
}

// ✅ SPOLEČNÁ FUNKCE PRO PŘESUN
function presun(sloupec, karta) {

  let puvodni = karta.parentElement;

  // uklid původního sloupce
  if (puvodni && puvodni.classList.contains("sloupec")) {
    let karty = puvodni.querySelectorAll(".karta");

    if (karty.length === 1) {
      puvodni.innerHTML = "";
    } else {
      karta.remove();
    }
  }

  // nový sloupec prázdný → přidej nadpis
  if (sloupec.querySelectorAll(".karta").length === 0) {
    let nadpis = document.createElement("div");
    nadpis.innerText = karta.dataset.v;
    nadpis.style.fontWeight = "bold";
    sloupec.appendChild(nadpis);
  }

  sloupec.appendChild(karta);

  vybranaKarta = null;
  tazenaKarta = null;

  document.getElementById("aktualni-karta").innerHTML = "";
}

document.addEventListener("DOMContentLoaded", function () {

  let sloupce = document.querySelectorAll(".sloupec");

  sloupce.forEach(function (sloupec) {

    // ✅ drag over (PC)
    sloupec.addEventListener("dragover", function (e) {
      e.preventDefault();
    });

    // ✅ drop (PC)
    sloupec.addEventListener("drop", function (e) {
      e.preventDefault();
      if (!tazenaKarta) return;
      presun(sloupec, tazenaKarta);
    });

    // ✅ klik (mobil)
    sloupec.addEventListener("click", function () {
      if (!vybranaKarta) return;
      presun(sloupec, vybranaKarta);
    });

  });

  generuj();
});
function zkontroluj() {
  document.querySelectorAll(".sloupec").forEach(function (sloupec) {

    let karty = sloupec.querySelectorAll(".karta");

    if (karty.length === 0) {
      sloupec.style.background = "#ffcdd2"; // červená
      return;
    }

    let v = karty[0].dataset.v;
    let ok = true;

    karty.forEach(function (karta) {
      if (karta.dataset.v !== v) ok = false;
    });

    if (ok && karty.length === 4) {
      sloupec.style.background = "#c8e6c9"; // zelená ✅
    } else if (ok) {
      sloupec.style.background = "#ffe082"; // žlutá ⚠️
    } else {
      sloupec.style.background = "#ffcdd2"; // červená ❌
    }

  });
}
function novaHra() {

  // vymaž sloupce
  document.querySelectorAll(".sloupec").forEach(function (sloupec) {
    sloupec.innerHTML = "";
    sloupec.style.background = "#c8e6c9";
  });

  // vymaž horní kartu
  document.getElementById("aktualni-karta").innerHTML = "";

  // nové karty
  generuj();
}
