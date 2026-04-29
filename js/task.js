let names = [
  "Aysel",
  "Murad",
  "Nigar",
  "Elvin",
  "Lalə",
  "Tural",
  "Sevinc",
  "Orxan",
  "Günel",
  "Rauf"
]

names.sort();

let container = document.getElementById('names-container');
container.innerHTML = names.join('<br>');
