const cartItems = document.getElementById("cart__items");
const totalQuantity = document.getElementById("totalQuantity");
const totalPrice = document.getElementById("totalPrice");
let cartTotalQuantity = 0;
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
      cartTotalQuantity += parseInt(item.quantity);
      for (const product of products) {
        if (product._id == item.id) {
          //console.log(product);
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
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}"  >
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>`
      );
    }
    totalQuantity.textContent = cartTotalQuantity;
    totalPrice.textContent = cartTotalPrice;

    const articles = Array.from(document.getElementsByClassName("cart__item"));
    console.log("articles => ", articles[0]);

    articles.forEach((article) => {
      article.addEventListener("change", (event) =>
        cartQuantitychanged(article, event)
      );
    });

    /* for (let i = 0; i < articles.length; i++) {
      articles[i].addEventListener("change", (event) => cartQuantitychanged(i));
    } */

    const deleteButtons = document.getElementsByClassName("deleteItem");

    for (let i = 0; i < deleteButtons.length; i++) {
      let articleToDelete = deleteButtons[i].closest("article");

      deleteButtons[i].addEventListener("click", () =>
        deleteArticle(articleToDelete)
      );
    }
  })
  .catch(function (err) {
    console.error(err);
  });

const cartQuantitychanged = (article, event) => {
  let getId = article.dataset.id;
  let getColor = article.dataset.color;

  let productIndex = cart.findIndex(
    (elem) => elem.id == getId && elem.color == getColor
  );

  cartTotalQuantity = 0;
  cartTotalPrice = 0;
  cart[productIndex].quantity = event.target.value;
  for (const product of cart) {
    cartTotalQuantity += parseInt(product.quantity);
    cartTotalPrice += product.price * product.quantity;
  }
  totalQuantity.textContent = cartTotalQuantity;
  totalPrice.textContent = cartTotalPrice;
};

const deleteArticle = (articleToDelete) => {
  let getId = articleToDelete.dataset.id;
  let getColor = articleToDelete.dataset.color;

  let productIndex = cart.findIndex(
    (elem) => elem.id == getId && elem.color == getColor
  );
  cartTotalQuantity -= parseInt(cart[productIndex].quantity);
  cartTotalPrice -= cart[productIndex].price * cart[productIndex].quantity;

  totalQuantity.textContent = cartTotalQuantity;
  totalPrice.textContent = cartTotalPrice;

  cart.splice(productIndex, 1);
  articleToDelete.remove();
};
