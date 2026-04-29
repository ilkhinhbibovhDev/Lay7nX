let cardContainer = document.querySelector(".cardContainer");

// yoxla görək tapılır?
console.log(cardContainer);

fetch("https://api.thecatapi.com/v1/images/search?limit=10")
  .then((res) => res.json())
  .then((data) => {
    console.log(data); // bunu aç bax

    data.forEach((item) => {
      let div = document.createElement("div");

      div.innerHTML = `
                <img src="${item.url}" width="200">
                <p>${item.breeds?.[0]?.description || "No info"}</p>
            `;

      cardContainer.appendChild(div);
    });
  })
  .catch((err) => console.log(err));