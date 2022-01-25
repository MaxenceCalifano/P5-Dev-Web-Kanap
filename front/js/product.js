//import { products } from "./script";

const product_img = document.getElementsByClassName("item__img");
const product_title = document.getElementById("title");
const product_descritption = document.getElementById("description");
const product_price = document.getElementById("price");
const product_options = document.getElementById("colors");
const product_quantity = document.getElementById("quantity");

const buttonAddToCart = document.getElementById("addToCart");

let color = "";
let quantity = 1;

const url = new URL(window.location.href);
const product_id = url.searchParams.get("id");

fetch("http://localhost:3000/api/products/")
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (value) {
    /*
     * search object that contain the id from the url and create element for each value
     */
    for (const item in value) {
      if (value[item]._id == product_id) {
        product_title.textContent = `${value[item].name}`;
        product_price.textContent = `${value[item].price}`;
        product_descritption.textContent = `${value[item].description}`;

        product_img[0].insertAdjacentHTML(
          "beforeend",
          `<img src="${value[item].imageUrl} " alt="${value[item].altTxt}"></img>`
        );

        for (const color of value[item].colors) {
          product_options.insertAdjacentHTML(
            "beforeend",
            `<option value="${color}">${color}</option>`
          );
        }
      }
    }
  })
  .catch(function (err) {
    console.error(err);
  });

product_options.addEventListener("change", (event) => {
  color = event.target.value;
});

product_quantity.addEventListener("change", (event) => {
  quantity = event.target.value;
});
let cart = JSON.parse(localStorage.getItem("cart"));
console.log(localStorage.getItem("cart"));

const addToCart = () => {
  if (cart == null) {
    cart = [{ id: product_id, quantity: quantity, color: color }];
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("hey");
    console.log(JSON.parse(localStorage.getItem("cart")));
  } else {
    //cart = JSON.parse(localStorage.getItem("cart"));
    const findProductToIncrement = cart.findIndex(
      (elem) => elem.id == product_id && elem.color == color /*compare(elem) */
    );
    if (findProductToIncrement == -1) {
      cart.push({ id: product_id, quantity: quantity, color: color });
      localStorage.setItem("cart", JSON.stringify(cart));
      console.log(JSON.parse(localStorage.getItem("cart")));
    } else {
      let totalQuantity =
        parseInt(quantity) + parseInt(cart[findProductToIncrement].quantity);
      cart[findProductToIncrement].quantity = totalQuantity;
      localStorage.setItem("cart", JSON.stringify(cart));
      console.log(JSON.parse(localStorage.getItem("cart")));
    }
  }
};

buttonAddToCart.addEventListener("click", addToCart);
//localStorage.clear();

/* let cart = [
  { id: 95651, color: "white", quantity: 6 },
  { id: 95651, color: "white", quantity: 6 },
]; */

/*
Cas ajouter : 
  localStrorage est vide ? :
  Oui : on ajoute le nouvel élément
  Non : 
    Parcourir les clé de localStorage : 
      SI il y a l'id de l'élément ? :
        Cet élément a-t-il la même couleur ?
          si oui : on incrémente la quantité
          si non : on ajoute le nouvel élément
*/
