let balans = 200;
let daxilEtdiyinizMebleg = null;
let texminEtdiyinizEdedNedir = null;
let comSecdiyiEded = null;
let ferq = null;
let devamEdek = null;

function mercOyunu(x) {
  daxilEtdiyinizMebleg = Number(prompt("Ne qeder mebleh daxil edirsiniz", 1));
  texminEtdiyinizEdedNedir = Number(prompt("Texmin etdiyiniz eded nedir?", 1));

  if (
    x < daxilEtdiyinizMebleg ||
    texminEtdiyinizEdedNedir < 1 ||
    texminEtdiyinizEdedNedir > 50
  ) {
    alert(
      "Meblegde bu qeder pul yoxdur ya da daxil etdiyiniz eded 1-50 arasinda deyil",
    );
    return;
  }

  comEddedSec();

  ferq = Math.abs(comSecdiyiEded - texminEtdiyinizEdedNedir);
  // 20 - 23 = -3
  // |-3| = 3

  if (comSecdiyiEded === texminEtdiyinizEdedNedir) {
    balans += daxilEtdiyinizMebleg * 5;
    // 100 + 25 = 125
    // 5 * 5 = 25
  } else if (ferq >= 1 && ferq <= 3) {
    balans += daxilEtdiyinizMebleg * 2;
    // 100 + 10 = 110
    // 5 * 2 = 10
  } else if (ferq >= 4 && ferq <= 7) {
    balans -= daxilEtdiyinizMebleg;
  } else {
    balans -= daxilEtdiyinizMebleg;
    // 10
    // 50
  }
}
