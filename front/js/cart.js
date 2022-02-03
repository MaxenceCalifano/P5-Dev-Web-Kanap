const cartItems = document.getElementById("cart__items");
const totalQuantity = document.getElementById("totalQuantity");
const totalPrice = document.getElementById("totalPrice");
let cartTotalQuantity = 0;
let cartTotalPrice = 0;
let cart = JSON.parse(localStorage.getItem("cart"));
let products = "";

const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);

if (params.has("order")) {
  localStorage.clear();
  let orderId = document.getElementById("orderId");
  orderId.textContent = url.searchParams.get("order");
}

Promise.all(
  cart.map((item) =>
    fetch(`http://localhost:3000/api/products/${item.id}`).then((res) =>
      res.json()
    )
  )
)
  .then((json) => {
    for (let i = 0; i < cart.length; i++) {
      cart[i].price = json[i].price;
      cart[i].name = json[i].name;
      cart[i].imageUrl = json[i].imageUrl;
      cart[i].altTxt = json[i].altTxt;
      cartTotalPrice += cart[i].price * cart[i].quantity;
      cartTotalQuantity += parseInt(cart[i].quantity);

      products += `<article class="cart__item" data-id="${cart[i].id}" data-color="${cart[i].color}">
      <div class="cart__item__img">
        <img src=${cart[i].imageUrl} alt=${cart[i].altTxt}>
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${cart[i].name}</h2>
          <p>${cart[i].color}</p>
          <p>${cart[i].price}€</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cart[i].quantity}"  >
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>
    </article>`;
    }
  })
  .then(() => {
    cartItems.insertAdjacentHTML("beforeend", products);
    totalQuantity.textContent = cartTotalQuantity;
    totalPrice.textContent = cartTotalPrice;

    const articles = Array.from(document.getElementsByClassName("cart__item")); // Get all articles and listen the value of quantity input

    articles.forEach((article) => {
      article.addEventListener("change", (event) => {
        cartQuantitychanged(article, event);
      });
    });

    const deleteButtons = document.getElementsByClassName("deleteItem"); // Get all delete buttons and listen click

    for (let i = 0; i < deleteButtons.length; i++) {
      let articleToDelete = deleteButtons[i].closest("article");

      deleteButtons[i].addEventListener("click", () =>
        deleteArticle(articleToDelete)
      );
    }
  })
  .catch((err) => console.error(err));

const cartQuantitychanged = (article, event) => {
  let getId = article.dataset.id;
  let getColor = article.dataset.color;

  let productIndex = cart.findIndex(
    (elem) => elem.id == getId && elem.color == getColor
  );

  cartTotalQuantity = 0;
  cartTotalPrice = 0;
  cart[productIndex].quantity = event.target.value;

  let localStorageCart = JSON.parse(localStorage["cart"]);
  localStorageCart[productIndex].quantity = event.target.value;
  localStorage.setItem("cart", JSON.stringify(localStorageCart));

  for (const product of cart) {
    cartTotalQuantity += parseInt(product.quantity);
    cartTotalPrice += product.price * product.quantity;
  }
  totalQuantity.textContent = cartTotalQuantity;
  totalPrice.textContent = cartTotalPrice;
};

const deleteArticle = (articleToDelete) => {
  const getId = articleToDelete.dataset.id;
  const getColor = articleToDelete.dataset.color;

  let productIndex = cart.findIndex(
    (elem) => elem.id == getId && elem.color == getColor
  );
  cartTotalQuantity -= parseInt(cart[productIndex].quantity);
  cartTotalPrice -= cart[productIndex].price * cart[productIndex].quantity;

  totalQuantity.textContent = cartTotalQuantity;
  totalPrice.textContent = cartTotalPrice;

  let localStorageCart = JSON.parse(localStorage["cart"]);
  localStorageCart.splice(productIndex, 1);
  localStorage.setItem("cart", JSON.stringify(localStorageCart));

  cart.splice(productIndex, 1);
  articleToDelete.remove();
};

//Form validation
let contact = {};

const testUserInput = (testString, testRegex, errMsgPlaceholder, errorMsg) => {
  if (testRegex.test(testString.value)) {
    errMsgPlaceholder.textContent = "";
    contact[testString.name] = testString.value;
  } else {
    errMsgPlaceholder.textContent = errorMsg;
    contact[testString.name] = "";
  }
};

const errPhrase = (field) =>
  `Le texte entré est vide ou contient des caractères non-acceptés, veuillez saisir votre ${field} à nouveau`;

const firstName = document.getElementById("firstName");
const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
firstName.addEventListener("blur", (e) => {
  testUserInput(firstName, /[a-zA-Z]+/, firstNameErrorMsg, errPhrase("prénom"));
});

const lastName = document.getElementById("lastName");
const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
lastName.addEventListener("blur", (e) => {
  testUserInput(
    lastName,
    /^[^/,:<>!_~@#$%^&()+=?()“|!\[#$0-9]+$/,
    lastNameErrorMsg,
    errPhrase("nom")
  );
});

const address = document.getElementById("address");
const addressErrorMsg = document.getElementById("addressErrorMsg");
address.addEventListener("blur", (e) =>
  testUserInput(
    address,
    /^[^;,:<>!_~@#$%^&()+=?()“|!\[#$]+$/,
    addressErrorMsg,
    errPhrase("adresse")
  )
);

const city = document.getElementById("city");
const cityErrorMsg = document.getElementById("cityErrorMsg");

city.addEventListener("blur", (e) =>
  testUserInput(
    city,
    /^[^;,:<>!_~@#$%^&()+=?()“|!\[#$0-9]+$/,
    cityErrorMsg,
    errPhrase("ville")
  )
);

const email = document.getElementById("email");
const emailErrorMsg = document.getElementById("emailErrorMsg");

email.addEventListener("blur", (e) =>
  testUserInput(
    email,
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
    emailErrorMsg,
    "l'addresse e-mail entrée semble invalide, veuillez la vérifier s'il vous plait"
  )
);

const idsArray = cart.map((product) => product.id);

const order = document
  .getElementById("order")
  .addEventListener("click", (e) => {
    e.preventDefault();

    if (Object.keys(contact).length < 5) {
      return console.log(
        "Veuillez compléter le formulaire pour passer commande"
      );
    } else {
      for (const property in contact) {
        if (contact[property] == "") {
          return console.log(
            "Veuillez compléter le formulaire pour passer commande"
          );
        }
        fetch("http://localhost:3000/api/products/order", {
          method: "POST",

          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            contact: contact,
            products: idsArray,
          }),
        })
          .then((response) => response.json())
          .then((json) => {
            window.location.assign(`./confirmation.html?order=${json.orderId}`);
          });
      }
    }
  });
