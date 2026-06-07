let balicek = [];
let vybranaKarta = null;

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

  // zamíchání
  balicek.sort(function () {
    return Math.random() - 0.5;
  });
}

function vytvorKartu(text, vysledek) {
  let karta = document.createElement("div");
  karta.className = "karta";
  karta.innerText = text;
  karta.dataset.v = vysledek;

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

function vlozKartu(sloupec, karta) {
  let puvodniSloupec = karta.parentElement;

  // ✅ úklid původního sloupce
  if (puvodniSloupec && puvodniSloupec.classList.contains("sloupec")) {

    let karty = puvodniSloupec.querySelectorAll(".karta");

    if (karty.length === 1) {
      puvodniSloupec.innerHTML = ""; // smaže nadpis i kartu
    } else {
      karta.remove(); // smaže jen kartu
    }
  }

  // ✅ nový sloupec – pokud prázdný
  if (sloupec.querySelectorAll(".karta").length === 0) {
    let nadpis = document.createElement("div");
    nadpis.innerText = karta.dataset.v;
    nadpis.style.fontWeight = "bold";
    sloupec.appendChild(nadpis);
  }

  // ✅ vložení
  sloupec.appendChild(karta);

  // ✅ reset
  vybranaKarta = null;
  document.getElementById("aktualni-karta").innerHTML = "";
}

document.addEventListener("DOMContentLoaded", function () {

  let sloupce = document.querySelectorAll(".sloupec");

  sloupce.forEach(function (sloupec) {

    sloupec.addEventListener("click", function () {
      if (!vybranaKarta) return;

      vlozKartu(sloupec, vybranaKarta);
    });

  });

  generuj();
});
