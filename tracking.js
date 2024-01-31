// Surveille les visites de longue durée
function longVisit() {
  let timeVisit = parseInt(
    document.body.getAttribute("ph_long-visit-duration")
  );
  if (!isNaN(timeVisit) && timeVisit > 0) {
    setTimeout(() => {
      window.dataLayer.push({ event: "longVisite" });
      console.log("Long visit event triggered");
    }, timeVisit);
  } else {
    console.error("Invalid 'ph_long-visit-duration' value");
  }
}

// Suivi des vues de page
function pageView() {
  try {
    let pageTitle = document.title;
    let pageCat = document.body.getAttribute("ph_page-cat");

    // Créer un objet eventInfo avec une structure similaire aux autres push dataLayer
    let eventInfo = {
      event: "pageview",
      title: pageTitle,
      pagecat: pageCat ||
        'default-category' // Utilisez une catégorie par défaut si pageCat est nul
    };

    window.dataLayer.push(eventInfo);

  } catch (error) {
    console.error("Error in pageView function:", error);
  }
}

// Suivi des clics sur les liens
document.querySelectorAll("a[ph_link-name]").forEach((link) => {
  link.addEventListener("click", () => {
    let linkName = link.getAttribute("ph_link-name");
    if (linkName) {
      window.dataLayer.push({
        event: "interaction_button",
        nom_clic: linkName,
      });
    } else {
      console.warn("Link clicked without 'ph_link-name' attribute");
    }
  });
});

// Suivi des interactions sur les inputs
document.querySelectorAll("[ph_form] input:first-of-type").forEach((input) => {
  input.addEventListener("click", () => {
    let form = input.closest("form");
    let inputname = form.getAttribute("data-name");
    let formposition = form.getAttribute("ph_form");
    if (inputname && formposition) {
      window.dataLayer.push({
        event: "interaction_form",
        name: inputname,
        position: formposition,
      });
    } else {
      console.warn("Input clicked without required attributes");
    }
  });
});

// Suivi des soumissions de formulaire
document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", () => {
    let formposition = form.getAttribute("ph_form");
    let formName = form.getAttribute("data-name");
    if (formposition && formName) {
      window.dataLayer.push({
        event: "submit_form",
        position: formposition,
        name: formName,
      });
    } else {
      console.warn("Form submitted without required attributes");
    }
  });
});

// IntersectionObserver pour les formulaires
let observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        let form = entry.target;
        let formName = form.getAttribute("data-name");
        let formPosition = form.getAttribute("ph_form");
        if (formName && formPosition) {
          window.dataLayer.push({
            event: "view_form",
            name: formName,
            position: formPosition,
          });
          observer.unobserve(form); // Une seule fois par formulaire
        } else {
          console.warn("Form without required attributes observed");
        }
      }
    });
  }, { threshold: [0] }
);
document.addEventListener('DOMContentLoaded', () => {

longVisit();
pageView();
document.querySelectorAll("[ph_form]").forEach((form) => {
  observer.observe(form);
});
});
