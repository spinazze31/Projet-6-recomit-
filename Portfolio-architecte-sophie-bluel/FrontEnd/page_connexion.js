let errorConnexion = document.querySelector(".error_connexion");

let form = document.querySelector(".form_container");
form.addEventListener("submit", (event) => {
  event.preventDefault();

  //Récupération des valeurs entrées par l'utilisateur
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  //Conversion au format json pour compréhension par l'api
  const loginValues = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  };

  //Récupération de la réponse de l'api suite à l'envoi des données
  fetch("http://localhost:5678/api/users/login", loginValues)
    .then((res) => res.json())
    .then((resRequest) => {
      if (resRequest.token) {
        window.localStorage.setItem("token", resRequest.token);
        window.location.href = "./index.html";
      } else {
        errorConnexion.innerText = "login ou password incorrect";
      }
    })
    .catch((error) => {
      console.log(error);
    });
});
