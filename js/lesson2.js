function BankAccount(ownerName, initialBalance) {
  this.ownerName = ownerName;
  this.balance = initialBalance;

  this.deposit = function (amount) {
    this.balance += amount;
    console.log(amount + " AZN balansınıza əlavə olundu.");
  };

  this.showBalance = function () {
    console.log(
      `Hörmətli ${this.ownerName}, sizin cari balansınız: ${this.balance} AZN-dir`,
    );
  };
}

const myAccount = new BankAccount("Ilkin", 100);
myAccount.deposit(50);
myAccount.showBalance();
