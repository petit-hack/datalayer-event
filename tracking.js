function longVisit() {
  let timeVisit = $("body").attr("ph_long-visit-duration");
  setTimeout(() => {
    window.dataLayer.push({
      event: "longVisite"
    });
    console.log("je me suis active");
  }, timeVisit);
}

/*Appliquer l'attribut ph_page-cat sur le body pour pouvoir appliquer une catégorie de page */
function pageView() {
  let pageTitle = document.title;
  let pageCat = $("body").attr("ph_page-cat");
  if (pageCat !== undefined) {
    window.dataLayer.push({
      event: "page_view",
      pagecat: pageCat,
      title: pageTitle
    });
  } else {
    window.dataLayer.push({
      event: "page_view",
      title: pageTitle
    });
  }
}

function clickName(linkName) {
  window.dataLayer.push({
    event: "interaction_button",
    nom_clic: linkName
  });
}
function clickInput(inputname, formposition) {
  window.dataLayer.push({
    event: "interaction_form",
    name: inputname,
    position: formposition
  });
}

function submitForm(formposition, formName) {
  window.dataLayer.push({
    event: "submit_form",
    position: formposition,
    name: formName
  });
}

//Page Load//
longVisit();
pageView();
//Trigger//

/*À la soumission de tous les formulaires, capture la valeur de l'attribut "ph_form" 
(à apposer sur le formulaire) du form et déclenche l'évènement "subscribe_newsletter" 
en utilisant la valeur de l'attribut comme paramètre de position. 
Bien pensé donc à ajouter l'attribut sinon position n'aura pas de valeur. 
COMPTABILISE QUAND MËME UNE SOUMISSION SI L'AATRIBUT NEXISTE PAS MAIS NE FAIT PAS REMONTER LA POSITION */
$("form").submit(function () {
  let formposition = $(this).attr("ph_form");
  let formName = $(this).attr("data-name");
  submitForm(formposition, formName);
});
/* Lorsque l'on clic sur un lien/button, capture la valeur de l'attribut "ph_link-name"
(à apposer sur le bouton) du bouton et déclenche l'évènement "interact"
IMPORTANT, n'est pas comtabilisé si le lien n'a pas l'attribut*/
$("a").on("click", function () {
  let linkName = $(this).attr("ph_link-name");
  if (linkName !== undefined) {
    clickName(linkName);
  }
});

/*Attention, se déclenche sur tous les formulaires ayant l'attribut [ph_form] (on s'en fiche de la valeur)
Attention de ne le déclencher qu'une fois par page dans le GTM */
var observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        window.dataLayer.push({ event: "view_form" });
        observer.unobserve(entry.target); // optionnel, pour ne déclencher l'événement qu'une seule fois par formulaire
      }
    });
  },
  { threshold: [0] }
);

// Observer tous les éléments avec l'attribut [ph_form]
document.querySelectorAll("[ph_form]").forEach(form => {
  observer.observe(form);
});


/* Suivi interaction sur les formulaires - attention de ne le déclencher qu'une fois par page dans GTM*/
$("[ph_form] input:first-of-type").on("click", function () {
  let inputname = $(this).closest("form").attr("data-name");
  let formposition = $(this).closest("form").attr("ph_form");
  clickInput(inputname, formposition);
});
