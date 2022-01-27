/*              
              Ce qu'il me faut : 
                ID
                couleur
                image
                nom du produit
                prix
                quantité*/

const cartItems = document.getElementById("cart__items");
const totalQuantity = document.getElementById("totalQuantity");
const totalPrice = document.getElementById("totalPrice");
let cartQuantity = 0;
let cartTotalPrice = 0;
let cart = JSON.parse(localStorage.getItem("cart"));
let products;
fetch("http://localhost:3000/api/products/")
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (value) {
    products = value;
    console.log("produits de l'API", products);

    for (const item of cart) {
      console.log("éléments dans le panier", item);
      cartQuantity += parseInt(item.quantity);
      for (const product of products) {
        if (product._id == item.id) {
          console.log(product);
          item.price = product.price;
          item.name = product.name;
          item.imageUrl = product.imageUrl;
          item.altTxt = product.altTxt;
          cartTotalPrice += item.price * item.quantity;
        }
      }
      cartItems.insertAdjacentHTML(
        "beforeend",
        `<article class="cart__item" data-id="${item.id}" data-color="${item.color}">
        <div class="cart__item__img">
          <img src=${item.imageUrl} alt=${item.altTxt}>
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${item.name}</h2>
            <p>${item.color}</p>
            <p>${item.price}€</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>`
      );
    }
    totalQuantity.textContent = cartQuantity;
    totalPrice.textContent = cartTotalPrice;
  })
  .catch(function (err) {
    console.error(err);
  });
