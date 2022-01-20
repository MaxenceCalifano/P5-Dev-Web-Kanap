fetch("http://localhost:3000/api/products/")
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (value) {
    insertProducts(value);
  })
  .catch(function (err) {
    console.error(err);
  });

/*
 * Go through API Json and create an html element for each product
 * @param {JSON}
 */
const insertProducts = (value) => {
  const items = document.getElementById("items");
  console.log(items);
  for (let item of value) {
    items.insertAdjacentHTML(
      "beforeend",
      `           
                   <a href="./product.html?id=${item._id}">
                   <article>
                     <img src="${item.imageUrl}" alt="${item.altTxt}">
                     <h3 class="productName">${item.name}</h3>
                     <p class="productDescription">${item.description}</p>
                   </article>
                 </a>`
    );
  }
};
//export default { products };
