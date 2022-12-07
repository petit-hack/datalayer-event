function longVisit() {
  setTimeout(() => {
    window.dataLayer.push({
      event: "longViste"
    });
  }, 180000);
}

/* Appliquer l'attribut ph-page-cat sur le body pour pouvoir appliquer une catégorie de page */
function pageView() {
  let pageTitle = document.title;
  let pageCat = $("body").attr("ph-page-cat");
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
    event: "interaction",
    nom_clic: linkName
  });
}
function clickInput(inputname) {
  window.dataLayer.push({
    event: "formInteraction",
    nom_clic: inputname
  });
}

function submitForm() {
  let formposition = $(this).attr("ph_form-position");
  let formName = $(this).attr("name");
  if (formposition !== undefined) {
    window.dataLayer.push({
      event: "subscribe_newsletter",
      position: formposition,
      name: formName
    });
  } else {
    window.dataLayer.push({
      event: "subscribe_newsletter",
      name: formName
    });
  }
}

//Page Load//
longVisit();
pageView();
//Trigger//

/*À la soumission de tous les formulaires, capture la valeur de l'attribut "form-position" 
(à apposer sur le formulaire) du form et déclenche l'évènement "subscribe_newsletter" 
en utilisant la valeur de l'attribut comme paramètre de position. 
Bien pensé donc à ajouter l'attribut sinon position n'aura pas de valeur. 
COMPTABILISE QUAND MËME UNE SOUMISSION SI L'AATRIBUT NEXISTE PAS MAIS NE FAIT PAS REMONTER LA POSITION */
$("form").submit(function () {
  submitForm();
});
/* Lorsque l'on clic sur un lien/button, capture la valeur de l'attribut "ph-link-name"
(à apposer sur le bouton) du bouton et déclenche l'évènement "interact"
IMPORTANT, n'est pas comtabilisé si le lien n'a pas l'attribut*/
$("a").on("click", function () {
  let linkName = $(this).attr("ph_link-name");
  if (linkName !== undefined) {
    clickName(linkName);
  }
});

/*Attention, se déclenche sur tous les formulaires ayant l'attribut [ph_form-view] (on s'en fiche de la valeur)
Attention de ne le déclencher qu'une fois par page dans le GTM */
var observer = new IntersectionObserver(
  function (entries) {
    if (entries[0].isIntersecting === true)
      window.dataLayer.push({
        event: "view_form",
        position: okgoogle
      });
  },
  { threshold: [0] }
);
observer.observe(document.querySelector("[ph_form-view]"));

/* Suivi interaction sur les formulaires - attention de ne le déclencher qu'une fois par page dans GTM*/
$("[ph_form-interaction] input:first-o").on("click", function () {
  let inputname = $(this).closest("form").attr("name");
  clickInput(inputname);
});
