class Vehicle {
  constructor(brand, year) {
    this.brand = brand;
    this.year = year;
  }
  getInfo() {
    return `Brand: ${this.brand}, Year: ${this.year}`;
  }
}

class Car extends Vehicle {
  constructor(brand, year, fuelType) {
    super(brand, year);
    this.fuelType = fuelType;
  }
  getInfo() {
    return `Brand: ${this.brand}, Year: ${this.year}, FuelType: ${this.fuelType}`;
  }
}

const vehicle1 = new Vehicle("Toyota", 2020);
const car1 = new Car("BMW", 2023, "Benzin");

function addResult(text, type) {
  const out = document.getElementById("output");
  const empty = out.querySelector(".out-empty");
  if (empty) empty.remove();

  const icon = type === "vo" ? "🚗" : "🏎️";
  const meta = type === "vo" ? "vehicle1.getInfo()" : "car1.getInfo()";

  const el = document.createElement("div");
  el.className = `out-item ${type}`;
  el.innerHTML = `
    <div class="out-icon">${icon}</div>
    <div>
      <div class="out-meta">${meta}</div>
      <div class="out-text">${text}</div>
    </div>
  `;
  out.prepend(el);
  while (out.children.length > 5) out.removeChild(out.lastChild);
}

function runVehicle() {
  addResult(vehicle1.getInfo(), "vo");
}
function runCar() {
  addResult(car1.getInfo(), "co");
}
