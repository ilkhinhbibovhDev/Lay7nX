.then((data) => {
  console.log;
  return data.json();

})
.then((data2) => {
  data2.forEach((item) => {
    let newDivElement = document.createElement("div");
    newDivElement.className ="col-sm-4 col-12 catImageCard";
    newDivElement.innerHTML = `;
    cardContainer.appendChild(newDivElement);
  });
})
.catch((err) => {
  console.log(err);
});