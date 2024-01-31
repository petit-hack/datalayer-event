/**
 * Surveille les visites de longue durée. Assurez-vous que l'attribut 'ph_long-visit-duration' est un nombre valide.
 */
function longVisit() {
  let timeVisit = parseInt($("body").attr("ph_long-visit-duration"));
  if (!isNaN(timeVisit) && timeVisit > 0) {
    setTimeout(() => {
      window.dataLayer.push({ event: "longVisite" });
      console.log("Long visit event triggered");
    }, timeVisit);
  } else {
    console.error("Invalid 'ph_long-visit-duration' value");
  }
}

/**
 * Suivi des vues de page. Utilisez l'attribut 'ph_page-cat' sur le body pour catégoriser les pages.
 */
function pageView() {
  try {
    let pageTitle = document.title;
    let pageCat = $("body").attr("ph_page-cat");
    let eventInfo = { event: "page_view", title: pageTitle };
    if (pageCat) {
      eventInfo.pagecat = pageCat;
    }
    window.dataLayer.push(eventInfo);
  } catch (error) {
    console.error("Error in pageView function:", error);
  }
}

/**
 * Suivi des clics sur les liens. Utilisez l'attribut 'ph_link-name' sur les liens pour les identifier.
 */
function clickName(linkName) {
  if (linkName) {
    window.dataLayer.push({
      event: "interaction_button",
      nom_clic: linkName
    });
  } else {
    console.warn("Link clicked without 'ph_link-name' attribute");
  }
}

/**
 * Suivi des interactions sur les inputs. Utilisez les attributs 'data-name' et 'ph_form' sur les formulaires.
 */
function clickInput(inputname, formposition) {
  if (inputname && formposition) {
    window.dataLayer.push({
      event: "interaction_form",
      name: inputname,
      position: formposition
    });
  } else {
    console.warn("Input clicked without required attributes");
  }
}

/**
 * Suivi des soumissions de formulaire. Utilisez les attributs 'data-name' et 'ph_form' sur les formulaires.
 */
function submitForm(formposition, formName) {
  if (formposition && formName) {
    window.dataLayer.push({
      event: "submit_form",
      position: formposition,
      name: formName
    });
  } else {
    console.warn("Form submitted without required attributes");
  }
}

/**
 * IntersectionObserver pour les formulaires. Suivi des formulaires vus.
 */
var observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        try {
          let formPosition = entry.target.getAttribute("ph_form"); // Utilisation de 'ph_form' pour la position
          let formName = entry.target.getAttribute("data-name"); // Utilisation de 'data-name' pour le nom
          if (formPosition && formName) {
            window.dataLayer.push({
              event: "view_form",
              position: formPosition, // Changé en 'position'
              name: formName // Changé en 'name'
            });
            observer.unobserve(entry.target); // Une seule fois par formulaire
          } else {
            console.warn("Form without required attributes observed");
          }
        } catch (error) {
          console.error("Error in observer callback:", error);
        }
      }
    });
  },
  { threshold: [0] }
);

/**
 * Application des observateurs et déclencheurs d'événements.
 */
$(document).ready(function() {
  longVisit();
  pageView();

  // Suivi des soumissions de formulaire
  $("form").submit(function () {
    let formposition = $(this).attr("ph_form");
    let formName = $(this).attr("data-name");
    submitForm(formposition, formName);
  });

  // Suivi des clics sur les liens
  $("a").on("click", function () {
    let linkName = $(this).attr("ph_link-name");
    clickName(linkName);
  });

  // Suivi des interactions sur les inputs de formulaire
  $("[ph_form] input:first-of-type").on("click", function () {
    let inputname = $(this).closest("form").attr("data-name");
    let formposition = $(this).closest("form").attr("ph_form");
    clickInput(inputname, formposition);
  });

  // Observer tous les éléments avec l'attribut [ph_form]
  document.querySelectorAll("[ph_form]").forEach(form => {
    observer.observe(form);
  });
});
