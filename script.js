let balicek = [];
let vybranaKarta = null;
let tazenaKarta = null;
let rezim = "porovnani";

// ✅ ZOBRAZENÍ ZLOMKŮ (OPRAVENO)
function zobraz(text) {

  function zlomek(a, b) {
    return `
      <div class="zlomek">
        <div class="horni">${a}</div>
        <div class="dolni">${b}</div>
      </div>
    `;
  }

  let casti = text.split(" ");
  let html = "";

  casti.forEach(function (c) {

    if (c.includes("/")) {
      let p = c.split("/");
      html += zlomek(p[0], p[1]);
    } else {
      html += `<span class="op">${c}</span>`;
    }

  });

  return html;
}

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
        let x = i;
let y = b * i;

let druhy = a*y - x*b;

priklad = x + "/" + y + " + " + druhy + "/" + y;


      } else if (rezim === "mix") {
        if (Math.random() < 0.5) {
          priklad = a + "/" + b + " + " + i + "/" + (b*i);
        } else {
          priklad = (a*i) + "/" + (b*i) + " - " + a + "/" + b;
        }

      } else if (rezim === "nasobeni") {
        if (Math.random() < 0.5) {
         priklad = a + "/" + (b * i) + " × " + i + "/1";
        } else {
         priklad = (a*i) + "/" + b + " ÷ " + i + "/1";
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

// ✅ KARTA
function vytvorKartu(text, vysledek) {
  let karta = document.createElement("div");
  karta.className = "karta";

  // ✅ TADY JE KLÍČOVÁ OPRAVA
  karta.innerHTML = zobraz(text);

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

// ✅ LÍZNUTÍ
function lizniKartu() {
  let zona = document.getElementById("aktualni-karta");

  if (balicek.length === 0) {
    zona.innerHTML = "<b>Konec hry ✅</b>";
    return;
  }

  let k = balicek.pop();

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

// ✅ FUNKCE PRO TLAČÍTKA
window.nastavRezim = function (r) {
  rezim = r;
  novaHra();
};

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

window.novaHra = function () {

  document.querySelectorAll(".sloupec").forEach(function (sloupec) {
    sloupec.innerHTML = "";
    sloupec.style.background = "#c8e6c9";
  });

  document.getElementById("aktualni-karta").innerHTML = "";

  generuj();
};
