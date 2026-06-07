let balicek = [];
let vybranaKarta = null;
let tazenaKarta = null;
let rezim = "porovnani";

// ✅ GENEROVÁNÍ
function generuj() {
  balicek = [];

  let vysledky = ["1/2", "1/3", "2/3", "3/4", "4/5"];

  vysledky.forEach(function (z) {
    let casti = z.split("/");
    let a = parseInt(casti[0]);
    let b = parseInt(casti[1]);

    for (let i = 1; i <= 4; i++) {

      let priklad = "";

      if (rezim === "porovnani") {
        priklad = (a * i) + "/" + (b * i);

      } else if (rezim === "scitani") {
        let c = i;
        let d = b * i;
        priklad = a + "/" + b + " + " + c + "/" + d;

      } else if (rezim === "mix") {
        if (Math.random() < 0.5) {
          priklad = a + "/" + b + " + " + i + "/" + (b*i);
        } else {
          priklad = (a*i) + "/" + (b*i) + " - " + a + "/" + b;
        }

      } else if (rezim === "nasobeni") {
        if (Math.random() < 0.5) {
          priklad = a + "/" + b + " × " + i + "/1";
        } else {
          priklad = (a*i) + "/" + (b*i) + " ÷ " + i + "/1";
        }
      }

      balicek.push({
        priklad: priklad,
        vysledek: z
      });

    }
  });

  balicek.sort(function () {
    return Math.random() - 0.5;
  });
}
function prevedZlomek(text) {

  // pokud je jen zlomek (např. 2/3)
  if (!text.includes(" ")) {
    let parts = text.split("/");

    return `
      <div class="zlomek">
        <span>${parts[0]}</span>
        <span>${parts[1]}</span>
      </div>
    `;
  }

  // pokud je příklad (např. 1/2 + 1/4)
  let casti = text.split(" ");

  let vystup = "";

  casti.forEach(function (c) {

    if (c.includes("/")) {
      let p = c.split("/");

      vystup += `
        <div class="zlomek">
          <span>${p[0]}</span>
          <span>${p[1]}</span>
        </div>
      `;
    } else {
      vystup += `<span class="operator">${c}</span>`;
    }

  });

  return vystup;
}
// ✅ KARTA
function vytvorKartu(text, vysledek) {
  let karta = document.createElement("div");
  karta.className = "karta";
  karta.innerHTML = prevedZlomek(text);
  karta.dataset.v = vysledek;
  karta.draggable = true;

  karta.addEventListener("dragstart", function () {
    tazenaKarta = karta;
  });

  karta.addEventListener("click", function () {
    vybranaKarta = karta;
  });

  return karta;
}

// ✅ LÍZNOUT
function lizniKartu() {
  if (balicek.length === 0) return;

  let k = balicek.pop();

  let zona = document.getElementById("aktualni-karta");
  zona.innerHTML = "";
  zona.appendChild(vytvorKartu(k.priklad, k.vysledek));
}

// ✅ PŘESUN
function presun(sloupec, karta) {

  let puvodni = karta.parentElement;

  if (puvodni && puvodni.classList.contains("sloupec")) {
    let karty = puvodni.querySelectorAll(".karta");

    if (karty.length === 1) {
      puvodni.innerHTML = "";
    } else {
      karta.remove();
    }
  }

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

// ✅ INIT
document.addEventListener("DOMContentLoaded", function () {

  document.querySelectorAll(".sloupec").forEach(function (sloupec) {

    sloupec.addEventListener("dragover", function (e) {
      e.preventDefault();
    });

    sloupec.addEventListener("drop", function (e) {
      e.preventDefault();
      if (!tazenaKarta) return;
      presun(sloupec, tazenaKarta);
    });

    sloupec.addEventListener("click", function () {
      if (!vybranaKarta) return;
      presun(sloupec, vybranaKarta);
    });

  });

  generuj();
});

// ✅ REŽIMY
window.nastavRezim = function (r) {
  rezim = r;
  novaHra();
};

// ✅ KONTROLA
window.zkontroluj = function () {
  document.querySelectorAll(".sloupec").forEach(function (sloupec) {

    let karty = sloupec.querySelectorAll(".karta");

    if (karty.length === 0) {
      sloupec.style.background = "#ffcdd2";
      return;
    }

    let v = karty[0].dataset.v;
    let ok = true;

    karty.forEach(function (karta) {
      if (karta.dataset.v !== v) ok = false;
    });

    if (ok && karty.length === 4) {
      sloupec.style.background = "#c8e6c9";
    } else if (ok) {
      sloupec.style.background = "#ffe082";
    } else {
      sloupec.style.background = "#ffcdd2";
    }

  });
};

// ✅ NOVÁ HRA
window.novaHra = function () {

  document.querySelectorAll(".sloupec").forEach(function (sloupec) {
    sloupec.innerHTML = "";
    sloupec.style.background = "#c8e6c9";
  });

  document.getElementById("aktualni-karta").innerHTML = "";

  generuj();
};
