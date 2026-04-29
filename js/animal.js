class Animal {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  makeSound() {
    console.log("Səs çıxardı!");
  }
}

class Cat extends Animal {
  constructor(name, age, penceSayi) {
    super(name, age);
    this.penceSayi = penceSayi;
  }

  fetch(message) {
    console.log(message + this.name + " topu getirdi!");
  }
}

class Birds extends Animal {
  constructor(name, age, lelekSayi) {
    super(name, age);
    this.lelekSayi = lelekSayi;
  }

  fly(message) {
    console.log(message + this.name + " ucdu!");
  }
}

let cat = new Cat("Tomy", 3, 4);
let bird = new Birds("Cek", 2, 40);

console.log(cat.name);
console.log(cat.age);
console.log(cat.penceSayi);

cat.makeSound();
cat.fetch("Pisik ");

console.log(bird.name);
console.log(bird.age);
console.log(bird.lelekSayi);

bird.makeSound();
bird.fly("Quş ");
