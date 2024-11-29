let logout = document.getElementById("login");
let modifyIcon = document.querySelector(".modify_icon");
let modifyText = document.getElementById("modify");
const shadow = document.querySelector(".shadow");
const visibilityModale = document.querySelector(".modale");
const closeIcon = document.querySelector(".close_icon");
const modaleButton = document.querySelector(".modale_button");
const addModale = document.querySelector(".add_modale");
const returnIcon = document.querySelector(".return_icon");
const crossIcon = document.getElementById("close");
let modaleFormTitle = document.querySelector(".modale_form-title");
const modaleFormCategory = document.querySelector(".modale_form-category");

//Création du container des filtres

let portfolioDivElt = document.createElement("div");
portfolioDivElt.classList = "filter_container";
let divParent = document.getElementById("portfolio");
divParent.appendChild(portfolioDivElt);

const divPosition = document.querySelector(".gallery");
divPosition.before(portfolioDivElt);

//Récupération des travaux

fetch("http://localhost:5678/api/works")
  .then((res) => res.json())
  .then((works) => {
    createImages(works);
    deleteWork();
    createWork();

    //Récupération des catégories

    fetch("http://localhost:5678/api/categories")
      .then((res) => res.json())
      .then((categories) => {
        portfolioDivElt.innerHTML = "";
        createFilters(categories);
        filterWorks(categories, works);
      });
  });

//Création des filtres

function createFilters(categories) {
  createFilter("Tous", 0);
  for (let i = 0; i < categories.length; i++) {
    createFilter(categories[i].name, categories[i].id);
  }
}

function createFilter(name, id) {
  const filter = document.createElement("button");
  const filterTitle = name;
  const filterId = "filter" + id;
  filter.classList = "filter_setting";
  filter.id = filterId;
  filter.innerHTML = filterTitle;
  document.querySelector(".filter_container").appendChild(filter);
}

//Création d'un travail

function createImage(work) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");
  const imageSource = work.imageUrl;
  const imageTitle = work.title;
  const imageId = work.categoryId;
  figure.id = work.id;
  figure.setAttribute("data-id", work.id);
  img.src = imageSource;
  figcaption.innerHTML = imageTitle;
  img.id = imageId;
  figure.appendChild(img);
  figure.appendChild(figcaption);
  document.querySelector(".gallery").appendChild(figure);
}

function createImages(works) {
  document.querySelector(".gallery").innerHTML = "";
  works.forEach((work) => {
    createImage(work);
    createModaleImage(work);
  });
}

function filterWorks(categories, works) {
  for (let i = 1; i < categories.length + 1; i++) {
    filterWork(works, i);
  }
}

//Fonction de filtrage des travaux

function filterWork(works, index) {
  const buttonAll = document.getElementById("filter0");
  buttonAll.classList.add("filter_active");
  buttonAll.addEventListener("click", (e) => {
    if (!buttonAll.classList.contains("filter_active")) {
      buttonAll.classList.add("filter_active");
    }
    const allFilterButtons = document.querySelectorAll(".filter_setting");
    allFilterButtons.forEach((button) => {
      if (button !== buttonAll) {
        button.classList.remove("filter_active");
      }
    });
    let filteredWorksAll = works.filter(function (work) {
      return work.categoryId === work.categoryId;
    });
    document.querySelector(".gallery").innerHTML = "";
    filteredWorksAll.forEach((work) => {
      createImage(work);
    });
  });
  const filterButton = document.getElementById("filter" + index);
  filterButton.addEventListener("click", (e) => {
    const allFilterButtons = document.querySelectorAll(".filter_setting");
    allFilterButtons.forEach((button) => {
      button.classList.remove("filter_active");
    });
    filterButton.classList.add("filter_active");
    let filteredWorks = works.filter(function (work) {
      return work.categoryId === index;
    });
    document.querySelector(".gallery").innerHTML = "";
    filteredWorks.forEach((work) => {
      createImage(work);
    });
  });
}

const token = window.localStorage.getItem("token");

//Fonction de création d'un travail dans la modale

function createModaleImage(work) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const garbageIcon = document.createElement("i");
  const imageSource = work.imageUrl;
  const imageId = work.categoryId;
  figure.setAttribute("data-id", work.id);
  garbageIcon.classList = "fa-regular fa-trash-can garbage_icon";
  garbageIcon.setAttribute("data-id", work.id);
  img.src = imageSource;
  img.id = imageId;
  figure.classList = "modale_image";
  figure.appendChild(img);
  figure.appendChild(garbageIcon);
  document.querySelector(".modale_image-container").appendChild(figure);
}

const filterContainer = document.querySelector(".filter_container");

if (token) {
  logout.innerText = "logout";
  logout.setAttribute("href", "");
  modifyIcon.style.display = "initial";
  modifyText.innerText = "modifier";
  filterContainer.style.display = "none";
}

//Modales

modifyText.addEventListener("click", (e) => {
  visibilityModale.style.visibility = "visible";
  shadow.style.display = "initial";
  submitModaleButton.style.backgroundColor = "#a7a7a7";
  deletePreviewImage();
});

closeIcon.addEventListener("click", (e) => {
  visibilityModale.style.visibility = "hidden";
  shadow.style.display = "none";
});

modaleButton.addEventListener("click", (e) => {
  addModale.style.visibility = "visible";
});

returnIcon.addEventListener("click", (e) => {
  addModale.style.visibility = "hidden";
  deletePreviewImage();
});

crossIcon.addEventListener("click", (e) => {
  addModale.style.visibility = "hidden";
  visibilityModale.style.visibility = "hidden";
  shadow.style.display = "none";
});

function closeModale(e) {
  if (e.target === shadow) {
    visibilityModale.style.visibility = "hidden";
    addModale.style.visibility = "hidden";
    shadow.style.display = "none";
  }
}
document.body.addEventListener("click", closeModale);

function deletePreviewImage() {
  modaleFormTitle.value = "";
  modaleFormCategory.value = "";
  const previewImage = document.querySelector(".add_modale-image img");
  if (previewImage) {
    previewImage.remove();
  }
  addImage.value = "";
}

//Fonction de suppression d'un travail

function deleteWork() {
  const figureDataModale = document.querySelectorAll(
    ".modale_image-container figure"
  );
  const figureData = document.querySelectorAll(".gallery figure");
  const garbageIcon = document.querySelectorAll(".modale_image-container i");

  for (let i = 0; i < garbageIcon.length; i++) {
    garbageIcon[i].addEventListener("click", (e) => {
      const id = garbageIcon[i].dataset.id;
      if (id === figureDataModale[i].dataset.id) {
        figureDataModale[i].remove();
        figureData[i].remove();
        deleteWorkFromServer(id);
      }
    });
  }
}

function deleteWorkFromServer(id) {
  fetch("http://localhost:5678/api/works/" + id, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
}

const submitModaleButton = document.getElementById("submit_modale-button");
const addImage = document.querySelector('input[type="file"]');

// Fonction de vérification avant envoi

function checkForm() {
  const title = modaleFormTitle.value;
  const category = modaleFormCategory.value;
  const file = addImage.files.length > 0;

  if (title && category > 0 && file) {
    submitModaleButton.style.backgroundColor = "#1d6154";
  } else submitModaleButton.style.backgroundColor = "#a7a7a7";
}

// Ecouteur d'événements pour vérifier les champs du formulaire

modaleFormTitle.addEventListener("input", checkForm);
modaleFormCategory.addEventListener("change", checkForm);
addImage.addEventListener("change", checkForm);

const addModaleButton = document.querySelector(".add_modale-button");
const addModaleImage = document.querySelector(".add_modale-image");

function previewImage(event) {
  const addImage = event.target.files;

  if (addImage.length > 0) {
    const file = addImage[0];
    const existingImage = addModaleImage.querySelector(".new_modale-image");

    const newImage = document.createElement("img");
    newImage.classList = "new_modale-image";
    newImage.src = URL.createObjectURL(file);
    addModaleImage.appendChild(newImage);
    newImage.style.display = "initial";
  }
}
addImage = document.querySelector('input[type="file"]');
addImage.addEventListener("change", previewImage);

//Creation nouvelle image sur le serveur depuis la modale

function createWork() {
  let modaleForm = document.querySelector(".modale_form");

  modaleForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const addImage = document.querySelector('input[type="file"]').files;
    const file = addImage[0];

    const modaleFormTitleValue = modaleFormTitle.value;

    const modaleFormCategoryValue = modaleFormCategory.value;
    const modaleCategoryNumber = parseInt(modaleFormCategoryValue);

    if (file && modaleFormTitleValue && modaleCategoryNumber) {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", modaleFormTitleValue);
      formData.append("category", modaleCategoryNumber);

      createWorkToServer(formData);
    }
  });
}

//Envoi de la requête au serveur + création nouvelle image (page d'accueil et modale)

function createWorkToServer(formData) {
  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
    body: formData,
  })
    .then((res) => res.json())
    .then((newWork) => {
      createImage(newWork);
      createModaleImage(newWork);
      visibilityModale.style.visibility = "hidden";
      addModale.style.visibility = "hidden";
      shadow.style.display = "none";
    })
    .catch((error) => {
      console.log(error);
    });
}

//Déconnexion

logout.addEventListener("click", (e) => {
  window.localStorage.removeItem("token");
});
