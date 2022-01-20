//import { products } from "./script";

const product_img = document.getElementsByClassName("item__img");
const product_title = document.getElementById("title");
const product_descritption = document.getElementById("description");
const product_price = document.getElementById("price");
const product_options = document.getElementById("colors");

const url = new URL(window.location.href);
const product_id = url.searchParams.get("id");

fetch("http://localhost:3000/api/products/")
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (value) {
    for (const item in value) {
      if (value[item]._id == product_id) {
        product = value[item];

        product_title.textContent = `${value[item].name}`;
        product_price.textContent = `${value[item].price}`;
        product_descritption.textContent = `${value[item].description}`;

        product_img[0].insertAdjacentHTML(
          "beforeend",
          `<img src="${value[item].imageUrl} " alt="${value[item].altTxt}"></img>`
        );

        for (const color of value[item].colors) {
          console.log(color);
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
