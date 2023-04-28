import { csv } from "d3-fetch";
import { select, selectAll } from "d3-selection";
import { transition } from "d3-transition";
import { easeLinear } from "d3-ease";
import { arc } from "d3-shape";
import { interpolate } from "d3-interpolate";
import { format } from "d3-format";
import { timeParse } from "d3-time-format";

//--TRAITEMENT DES DONNEES--//

// Pour importer les données (@rollup/plugin-dsv)
import planets from "../data/planets.csv";
//Trier les données
csv("../data/planets.csv").then(function (data) {
  data.map(
    (d) => (
      (d.color = +d.Color),
      (d.Mass = +d.Mass),
      (d.Density = +d.Density),
      (d.Diameter = +d["Diameter (km)"]),
      (d.Distance_from_sun = +d["Distance from Sun (10^6 km)"])
    )
  );

  const planets = data.map((planet) => ({
    name: planet.Planet,
    distance: planet.Distance_from_sun / 2,
    size: planet.Diameter / 2000,
    color: planet.Color,
  }));
  console.log(planets);

  //--- SVG ---//

  //La distance entre le soleil et Neptune
  const distanceMax = d3.max(planets.map((d) => d.distance));
  //Taille du svg
  const width = window.innerWidth;
  const height = 800;
  //Echelle
  const scale = d3
    .scaleSqrt()
    .domain([0, distanceMax + 10000])
    .range([200, width]);
  //Création du svg
  const svg = d3
    .select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  //--CREATION DES PLANETES--//
  planets.forEach((planet, index) => {
    //Création du soleil
    const soleil = svg
      .append("circle")
      .attr("id", "Sun")
      .attr("cx", 100)
      .attr("cy", height / 2)
      .attr("r", 30)
      .attr("fill", "gold");
    //Création des orbites
    const orbit = svg
      .append("circle")
      .attr("id", "orbit")
      .attr("cx", 0)
      .attr("cy", height / 2)
      .attr("r", scale(planet.distance))
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-solid", "5,5");
    // Creation planète
    const boule = svg
      .append("circle")
      .attr("id", planet.name)
      .attr("cx", scale(planet.distance))
      .attr("cy", height / 2)
      .attr("r", planet.size / 2) // planet.size for real size
      .attr("fill", planet.color)
      .attr("stroke", "white");

    //-- FICHES DESCRIPTIVES SOLEIL --//

    //Description
    var descriptionSoleil = select("#Description1")
      .append("div")
      .attr("id", "description")
      .style(
        "background-image",
        "linear-gradient(to right, khaki, sandybrown )"
      )
      .style("border", "none")
      .style("padding", "10px")
      .style("display", "none")
      .style("position", "absolute")
      .style("left", `${width / 36}px`) // position horizontale centrée par rapport au cercle du Soleil
      .style("top", `${height / 2 + 183.5}px`); // position verticale en dessous du cercle du Soleil

    //Fiche astrologique
    var description2Soleil = select("#Description2")
      .append("div")
      .attr("id", "description")
      .style(
        "background-image",
        "linear-gradient(to right, sandybrown , khaki)"
      )
      .style("border", "none")
      .style("padding", "200px")
      .style("display", "none")
      .style("position", "absolute")
      .style("left", `${width / 2 + 200}px`) // position horizontale centrée par rapport au cercle du Soleil
      .style("top", `${height / 14}px`); // position verticale en dessous du cercle du Soleil

    //--INTERACTION SOLEIL & BOUTONS--//

    //agrandir le soleil au clic
    soleil.on("click", function () {
      soleil.transition().duration(1000).attr("r", 100);
      //Affichage de la fiche descriptive
      setTimeout(function () {
        descriptionSoleil.html(
          "<h2>Le Soleil</h2><p> Il est souvent considérée comme le cœur du thème astral.Il représente l'essence de notre être,notre identité et notre volonté de vivre.</p>" +
            "<p>Il est également considéré comme la source</p>" +
            "<br>" +
            "<p>de notre énergie vitale de notre motivation et de notre rayonnement personnel.</p>"
        );
        // Mise à jour du contenu de la fiche descriptive avec les informations du Soleil
        descriptionSoleil.html(
          "<h2>Le Soleil</h2><p> Il est souvent considérée comme le cœur du thème astral. Il représente l'essence de notre être,</p><p>notre identité et notre volonté de vivre. Il est également considéré comme la source de notre énergie vitale,</p><p>de notre motivation et de notre rayonnement personnel.</p>"
        );
        // Affichage de la fiche descriptive
        descriptionSoleil.style("display", "block");

        //Bouton fermer
        descriptionSoleil
          .append("button")
          .style("border", "1px solid sandybrown")
          .style("border-radius", "15px")
          .style("background-color", "white")
          .style("color", "sandybrown")
          .attr("id", "close")
          .text("Fermer")
          .on("click", function () {
            descriptionSoleil.style("display", "none");
            soleil.transition().duration(1000).attr("r", 30);
          });
        //Bouton en savoir plus
        descriptionSoleil
          .append("button")
          .style("border", "1px solid sandybrown")
          .style("border-radius", "15px")
          .style("background-color", "white")
          .style("color", "sandybrown")
          .attr("id", "close")
          .text("En savoir plus")
          .on("click", function () {
            //Affichage de la fiche astrologique
            description2Soleil.html(
              "<h4>Signification</h4><p>L'égo</p>" +
                "<h4>Symbole</h4><p>Vitalité et virilité</p>" +
                "<h4>Elément</h4><p>Associé au feu</p>" +
                "<h4>Couleur</h4><p>Or Jaune</p>"
            );
            //Bouton fermer fiche astrologique
            description2Soleil.style("display", "block");
            description2Soleil
              .append("button")
              .attr("id", "close")
              .style("border", "1px solid sandybrown")
              .style("border-radius", "15px")
              .style("background-color", "white")
              .style("color", "sandybrown")
              .text("Fermer")
              .on("click", function () {
                description2Soleil.style("display", "none");
                descriptionSoleil.style("display", "none");
                soleil.transition().duration(1000).attr("r", 30);
              });
          });
      }, 1000);
      //Fin du premier soleil on click
    });
    //Fin de la boucle
  });

  //--FICHE DESCRIPTIVE MERCURE --//
  //Description Mercure
  var descriptionMercure = select("#Description1")
    .append("div")
    .attr("id", "description")
    .style("background-image", "linear-gradient(to right, darkgray, dimgray )")
    .style("border", "none")
    .style("padding", "10px")
    .style("display", "none")
    .style("position", "absolute")
    .style("left", `${width / 36}px`) // position horizontale centrée par rapport au cercle du Soleil
    .style("top", `${height / 2 + 183.5}px`); // position verticale en dessous du cercle du Soleil

  //Fiche astrologique Mercure
  var description2Mercure = select("#Description2")
    .append("div")
    .attr("id", "description")
    .style("background-image", "linear-gradient(to right, darkgray, dimgray)")
    .style("border", "none")
    .style("padding", "200px")
    .style("display", "none")
    .style("position", "absolute")
    .style("left", `${width / 2 + 200}px`) // position horizontale centrée par rapport au cercle du Soleil
    .style("top", `${height / 14}px`); // position verticale en dessous du cercle du Soleil

  //--INTERACTION MERCURE & BOUTONS--//

  //récupérer la planète Mercure
  var planetMercure = select("#Mercury");

  planetMercure.on("click", function () {
    planetMercure.transition().duration(1000).attr("r", 100);
    //Affichage de la fiche descriptive de Mercure
    setTimeout(function () {
      descriptionMercure.html(
        "<h2>Mercure</h2><p> Mercure est associée en astrologie à la communication, à l’intelligence et à la curiosité. </p>" +
          "<p> Elle représente la façon dont une personne communique et traite l'information,</p>" +
          "<br>" +
          "<p> ainsi que la façon dont elle s'adapte à son environnement.</p>"
      );
      // Mise à jour du contenu de la fiche descriptive avec les informations de Mercure
      descriptionMercure.html(
        "<h2>Mercure</h2><p> Mercure est associée en astrologie à la communication, à l’intelligence et à la curiosité. Elle représente la façon dont une personne communique et traite l'information, ainsi que la façon dont elle s'adapte à son environnement.</p>"
      );
      // Affichage de la fiche descriptive Mercure
      descriptionMercure.style("display", "block");

      //Bouton fermer Mercure
      descriptionMercure
        .append("button")
        .style("border", "1px solid dimgray")
        .style("border-radius", "15px")
        .style("background-color", "white")
        .style("color", "dimgray")
        .attr("id", "close")
        .text("Fermer")
        .on("click", function () {
          descriptionMercure.style("display", "none");
          planetMercure.transition().duration(1000).attr("r", 10);
        });
      //Bouton en savoir plus Mercure
      descriptionMercure
        .append("button")
        .style("border", "1px solid dimgray")
        .style("border-radius", "15px")
        .style("background-color", "white")
        .style("color", "dimgray")
        .attr("id", "close")
        .text("En savoir plus")
        .on("click", function () {
          //Affichage de la fiche astrologique  Mercure
          description2Mercure.html(
            "<h4>Signification</h4><p>L'égo</p>" +
              "<h4>Symbole</h4><p>Vitalité et virilité</p>" +
              "<h4>Elément</h4><p>Associé au feu</p>" +
              "<h4>Couleur</h4><p>Or Jaune</p>"
          );

          //Bouton fermer fiche astrologique Mercure
          description2Mercure.style("display", "block");
          description2Mercure
            .append("button")
            .attr("id", "close")
            .style("border", "1px solid dimgray")
            .style("border-radius", "15px")
            .style("background-color", "white")
            .style("color", "sdimgray")
            .text("Fermer")
            .on("click", function () {
              description2Mercure.style("display", "none");
              descriptionMercure.style("display", "none");
              planetMercure.transition().duration(1000).attr("r", 10);
            });
        });
    }, 1000);
    //Fin du premier Mercure on click
  });

  //--FICHE DESCRIPTIVE VENUS --//
  //Description Venus
  var descriptionVenus = select("#Description1")
    .append("div")
    .attr("id", "description")
    .style("background-image", "linear-gradient(to right, orange, sienna )")
    .style("border", "none")
    .style("padding", "10px")
    .style("display", "none")
    .style("position", "absolute")
    .style("left", `${width / 36}px`) // position horizontale centrée par rapport au cercle du Soleil
    .style("top", `${height / 2 + 183.5}px`); // position verticale en dessous du cercle du Soleil

  //Fiche astrologique Venus
  var description2Venus = select("#Description2")
    .append("div")
    .attr("id", "description")
    .style("background-image", "linear-gradient(to right, orange, sienna )")
    .style("border", "none")
    .style("padding", "200px")
    .style("display", "none")
    .style("position", "absolute")
    .style("left", `${width / 2 + 200}px`) // position horizontale centrée par rapport au cercle du Soleil
    .style("top", `${height / 14}px`); // position verticale en dessous du cercle du Soleil

  //--INTERACTION VENUS & BOUTONS--//

  //récupérer la planète Venus
  var planetVenus = select("#Venus");

  planetVenus.on("click", function () {
    planetVenus.transition().duration(1000).attr("r", 100);
    //Affichage de la fiche descriptive de Venus
    setTimeout(function () {
      descriptionVenus.html(
        "<h2>Vénus</h2><p> Vénus représente notre manière d’aimer et notre façon d’exprimer notre affection. </p>" +
          "<p>  Elle est considérée comme la planète de l’amour,</p>" +
          "<br>" +
          "<p> de la beauté, de l’harmonie et de l’art.</p>"
      );
      // Mise à jour du contenu de la fiche descriptive avec les informations de Venus
      descriptionVenus.html(
        "<h2>Vénus</h2><p> Vénus représente notre manière d’aimer et notre façon d’exprimer notre affection. </p>" +
          "<p>  Elle est considérée comme la planète de l’amour,</p>" +
          "<p> de la beauté, de l’harmonie et de l’art.</p>"
      );
      // Affichage de la fiche descriptive Venus
      descriptionVenus.style("display", "block");

      //Bouton fermer Venus
      descriptionVenus
        .append("button")
        .style("border", "1px solid sienna")
        .style("border-radius", "15px")
        .style("background-color", "white")
        .style("color", "sienna")
        .attr("id", "close")
        .text("Fermer")
        .on("click", function () {
          descriptionVenus.style("display", "none");
          planetVenus.transition().duration(1000).attr("r", 10);
        });
      //Bouton en savoir plus Venus
      descriptionVenus
        .append("button")
        .style("border", "1px solid sienna")
        .style("border-radius", "15px")
        .style("background-color", "white")
        .style("color", "sienna")
        .attr("id", "close")
        .text("En savoir plus")
        .on("click", function () {
          //Affichage de la fiche astrologique  Venus
          description2Venus.html(
            "<h4>Signification</h4><p>L'affection</p>" +
              "<h4>Symbole</h4><p>Féminité et sensualité</p>" +
              "<h4>Elément</h4><p>Associée à l'air</p>" +
              "<h4>Couleur</h4><p>Vert et rose</p>"
          );

          //Bouton fermer fiche astrologique Venus
          description2Venus.style("display", "block");
          description2Venus
            .append("button")
            .attr("id", "close")
            .style("border", "1px solid sienna")
            .style("border-radius", "15px")
            .style("background-color", "white")
            .style("color", "sienna")
            .text("Fermer")
            .on("click", function () {
              description2Venus.style("display", "none");
              descriptionVenus.style("display", "none");
              planetVenus.transition().duration(1000).attr("r", 10);
            });
        });
    }, 1000);
    //Fin du premier Venus on click
  });

  //--FICHE DESCRIPTIVE TERRE --//
  //Description Terre
  var descriptionTerre = select("#Description1")
    .append("div")
    .attr("id", "description")
    .style("background-image", "linear-gradient(to right, seagreen, navy )")
    .style("border", "none")
    .style("padding", "10px")
    .style("display", "none")
    .style("position", "absolute")
    .style("left", `${width / 36}px`) // position horizontale centrée par rapport au cercle du Soleil
    .style("top", `${height / 2 + 183.5}px`); // position verticale en dessous du cercle du Soleil

  //Fiche astrologique Venus
  var description2Terre = select("#Description2")
    .append("div")
    .attr("id", "description")
    .style("background-image", "linear-gradient(to right, seagreen, navy)")
    .style("border", "none")
    .style("padding", "200px")
    .style("display", "none")
    .style("position", "absolute")
    .style("left", `${width / 2 + 200}px`) // position horizontale centrée par rapport au cercle du Soleil
    .style("top", `${height / 14}px`); // position verticale en dessous du cercle du Soleil

  //--INTERACTION VENUS & BOUTONS--//

  //récupérer la planète Terre
  var planetTerre = select("#Earth");

  planetTerre.on("click", function () {
    planetTerre.transition().duration(1000).attr("r", 100);
    //Affichage de la fiche descriptive de Terre
    setTimeout(function () {
      descriptionTerre.html(
        "<h2>La Terre</h2><p> En astrologie, la Terre est considérée comme un point neutre, appelé 'Ascendant' ou 'Horizon',</p>" +
          "<p>  qui est utilisé pour calculer le thème astral d'une personne en fonction de sa position de naissance.</p>"
      );
      // Mise à jour du contenu de la fiche descriptive avec les informations de Terre
      descriptionTerre.html(
        "<h2>La Terre</h2><p> En astrologie, la Terre est considérée comme un point neutre, appelé 'Ascendant' ou 'Horizon',</p>" +
          "<p>  qui est utilisé pour calculer le thème astral d'une personne en fonction de sa position de naissance.</p>"
      );
      // Affichage de la fiche descriptive Terre
      descriptionTerre.style("display", "block");

      //Bouton fermer Terre
      descriptionTerre
        .append("button")
        .style("border", "1px solid navy")
        .style("border-radius", "15px")
        .style("background-color", "white")
        .style("color", "navy")
        .attr("id", "close")
        .text("Fermer")
        .on("click", function () {
          descriptionTerre.style("display", "none");
          planetTerre.transition().duration(1000).attr("r", 10);
        });
      //Bouton en savoir plus Terre
      descriptionTerre
        .append("button")
        .style("border", "1px solid navy")
        .style("border-radius", "15px")
        .style("background-color", "white")
        .style("color", "navy")
        .attr("id", "close")
        .text("En savoir plus")
        .on("click", function () {
          //Affichage de la fiche astrologique  Terre
          description2Terre.html(
            "<h4>Signification</h4><p></p>" +
              "<h4>Symbole</h4><p></p>" +
              "<h4>Elément</h4><p></p>" +
              "<h4>Couleur</h4><p></p>"
          );

          //Bouton fermer fiche astrologique Terre
          description2Terre.style("display", "block");
          description2Terre
            .append("button")
            .attr("id", "close")
            .style("border", "1px solid navy")
            .style("border-radius", "15px")
            .style("background-color", "white")
            .style("color", "navy")
            .text("Fermer")
            .on("click", function () {
              description2Terre.style("display", "none");
              descriptionTerre.style("display", "none");
              planetTerre.transition().duration(1000).attr("r", 10);
            });
        });
    }, 1000);
    //Fin du premier Terre on click
  });

  //--FICHE DESCRIPTIVE MARS --//
  //Description Mars
  var descriptionMars = select("#Description1")
    .append("div")
    .attr("id", "description")
    .style("background-image", "linear-gradient(to right, salmon, tomato )")
    .style("border", "none")
    .style("padding", "10px")
    .style("display", "none")
    .style("position", "absolute")
    .style("left", `${width / 36}px`) // position horizontale centrée par rapport au cercle du Soleil
    .style("top", `${height / 2 + 183.5}px`); // position verticale en dessous du cercle du Soleil

  //Fiche astrologique Mars
  var description2Mars = select("#Description2")
    .append("div")
    .attr("id", "description")
    .style("background-image", "linear-gradient(to right, salmon, tomato)")
    .style("border", "none")
    .style("padding", "200px")
    .style("display", "none")
    .style("position", "absolute")
    .style("left", `${width / 2 + 200}px`) // position horizontale centrée par rapport au cercle du Soleil
    .style("top", `${height / 14}px`); // position verticale en dessous du cercle du Soleil

  //--INTERACTION MARS & BOUTONS--//

  //récupérer la planète Mars
  var planetMars = select("#Mars");

  planetMars.on("click", function () {
    planetMars.transition().duration(1000).attr("r", 100);
    //Affichage de la fiche descriptive de Mars
    setTimeout(function () {
      descriptionMars.html(
        "<h2>Mars</h2><p> Mars est associée au dieu romain de la guerre, Mars, d'où son nom.  </p>" +
          "<p>  Souvent considérée comme étant la planète de l'énergie, de l'ambition,</p>" +
          "<p> l'agression et de la passion.</p>"
      );
      // Mise à jour du contenu de la fiche descriptive avec les informations de Mars
      descriptionMars.html(
        "<h2>Mars</h2><p> Mars est associée au dieu romain de la guerre, Mars, d'où son nom.  </p>" +
          "<p>  Souvent considérée comme étant la planète de l'énergie, de l'ambition,</p>" +
          "<p> l'agression et de la passion.</p>"
      );
      // Affichage de la fiche descriptive Mars
      descriptionMars.style("display", "block");

      //Bouton fermer Mars
      descriptionMars
        .append("button")
        .style("border", "1px solid tomato")
        .style("border-radius", "15px")
        .style("background-color", "white")
        .style("color", "tomato")
        .attr("id", "close")
        .text("Fermer")
        .on("click", function () {
          descriptionMars.style("display", "none");
          planetMars.transition().duration(1000).attr("r", 10);
        });
      //Bouton en savoir plus Mars
      descriptionMars
        .append("button")
        .style("border", "1px solid tomato")
        .style("border-radius", "15px")
        .style("background-color", "white")
        .style("color", "tomato")
        .attr("id", "close")
        .text("En savoir plus")
        .on("click", function () {
          //Affichage de la fiche astrologique  Mars
          description2Mars.html(
            "<h4>Signification</h4><p>L'action</p>" +
              "<h4>Symbole</h4><p>Spontanéité et agressivité</p>" +
              "<h4>Elément</h4><p>Associée au feu</p>" +
              "<h4>Couleur</h4><p>Rouge et orange</p>"
          );

          //Bouton fermer fiche astrologique Mars
          description2Mars.style("display", "block");
          description2Mars
            .append("button")
            .attr("id", "close")
            .style("border", "1px solid tomato")
            .style("border-radius", "15px")
            .style("background-color", "white")
            .style("color", "tomato")
            .text("Fermer")
            .on("click", function () {
              description2Mars.style("display", "none");
              descriptionMars.style("display", "none");
              planetMars.transition().duration(1000).attr("r", 10);
            });
        });
    }, 1000);
    //Fin du premier Mars on click
  });

  //--FICHE DESCRIPTIVE JUPITER --//
  //Description Jupiter
  var descriptionJupiter = select("#Description1")
    .append("div")
    .attr("id", "description")
    .style(
      "background-image",
      "linear-gradient(to right, gainsboro, sandybrown )"
    )
    .style("border", "none")
    .style("padding", "10px")
    .style("display", "none")
    .style("position", "absolute")
    .style("left", `${width / 36}px`) // position horizontale centrée par rapport au cercle du Soleil
    .style("top", `${height / 2 + 183.5}px`); // position verticale en dessous du cercle du Soleil

  //Fiche astrologique Jupiter
  var description2Jupiter = select("#Description2")
    .append("div")
    .attr("id", "description")
    .style(
      "background-image",
      "linear-gradient(to right, gainsboro, sandybrown)"
    )
    .style("border", "none")
    .style("padding", "200px")
    .style("display", "none")
    .style("position", "absolute")
    .style("left", `${width / 2 + 200}px`) // position horizontale centrée par rapport au cercle du Soleil
    .style("top", `${height / 14}px`); // position verticale en dessous du cercle du Soleil

  //--INTERACTION JUPITER & BOUTONS--//

  //récupérer la planète Jupiter
  var planetJupiter = select("#Jupiter");

  planetJupiter.on("click", function () {
    planetJupiter.transition().duration(1000).attr("r", 100);
    //Affichage de la fiche descriptive de Jupiter
    setTimeout(function () {
      descriptionJupiter.html(
        "<h2>Jupiter</h2><p> Jupiter est considérée comme la planète de la chance et de l’expansion. </p>" +
          "<p>  Les personnes ayant une forte influence de Jupiter dans le thème astral sont de nature optimise et joyeuse. </p>"
      );
      // Mise à jour du contenu de la fiche descriptive avec les informations de Jupiter
      descriptionJupiter.html(
        "<h2>Jupiter</h2><p> Jupiter est considérée comme la planète de la chance et de l’expansion. </p>" +
          "<p>  Les personnes ayant une forte influence de Jupiter dans le thème astral sont de nature optimise et joyeuse. </p>"
      );
      // Affichage de la fiche descriptive Jupiter
      descriptionJupiter.style("display", "block");

      //Bouton fermer Jupiter
      descriptionJupiter
        .append("button")
        .style("border", "1px solid gainsboro")
        .style("border-radius", "15px")
        .style("background-color", "white")
        .style("color", "gainsboro")
        .attr("id", "close")
        .text("Fermer")
        .on("click", function () {
          descriptionJupiter.style("display", "none");
          planetJupiter.transition().duration(1000).attr("r", 10);
        });
      //Bouton en savoir plus Jupiter
      descriptionJupiter
        .append("button")
        .style("border", "1px solid gainsboro")
        .style("border-radius", "15px")
        .style("background-color", "white")
        .style("color", "gainsboro")
        .attr("id", "close")
        .text("En savoir plus")
        .on("click", function () {
          //Affichage de la fiche astrologique  Jupiter
          description2Jupiter.html(
            "<h4>Signification</h4><p>L'expansion</p>" +
              "<h4>Symbole</h4><p>Chance</p>" +
              "<h4>Elément</h4><p>Associée à l'air</p>" +
              "<h4>Couleur</h4><p>Violet et bleu</p>"
          );

          //Bouton fermer fiche astrologique Jupiter
          description2Jupiter.style("display", "block");
          description2Jupiter
            .append("button")
            .attr("id", "close")
            .style("border", "1px solid gainsboro")
            .style("border-radius", "15px")
            .style("background-color", "white")
            .style("color", "gainsboro")
            .text("Fermer")
            .on("click", function () {
              description2Jupiter.style("display", "none");
              descriptionJupiter.style("display", "none");
              planetJupiter.transition().duration(1000).attr("r", 10);
            });
        });
    }, 1000);
    //Fin du premier Jupiter on click
  });

  //--FICHE DESCRIPTIVE SATURNE --//
  //Description Saturne
  var descriptionSaturne = select("#Description1")
    .append("div")
    .attr("id", "description")
    .style("background-image", "linear-gradient(to right, moccasin, peru )")
    .style("border", "none")
    .style("padding", "10px")
    .style("display", "none")
    .style("position", "absolute")
    .style("left", `${width / 36}px`) // position horizontale centrée par rapport au cercle du Soleil
    .style("top", `${height / 2 + 183.5}px`); // position verticale en dessous du cercle du Soleil

  //Fiche astrologique Saturne
  var description2Saturne = select("#Description2")
    .append("div")
    .attr("id", "description")
    .style("background-image", "linear-gradient(to right, moccasin, peru)")
    .style("border", "none")
    .style("padding", "200px")
    .style("display", "none")
    .style("position", "absolute")
    .style("left", `${width / 2 + 200}px`) // position horizontale centrée par rapport au cercle du Soleil
    .style("top", `${height / 14}px`); // position verticale en dessous du cercle du Soleil

  //--INTERACTION SATURNE & BOUTONS--//

  //récupérer la planète Saturne
  var planetSaturne = select("#Saturn");

  planetSaturne.on("click", function () {
    planetSaturne.transition().duration(1000).attr("r", 100);
    //Affichage de la fiche descriptive de Saturne
    setTimeout(function () {
      descriptionSaturne.html(
        "<h2>Saturne</h2><p> Saturne représente la limitation, la discipline et la responsabilité.  </p>" +
          "<p>  Elle peut également représenter les défis, </p>" +
          "<p> les restrictions et les peurs qui peuvent être surmontées avec le temps et l'effort.</p>"
      );
      // Mise à jour du contenu de la fiche descriptive avec les informations de Saturne
      descriptionSaturne.html(
        "<h2>Saturne</h2><p> Saturne représente la limitation, la discipline et la responsabilité.  </p>" +
          "<p>  Elle peut également représenter les défis, </p>" +
          "<p> les restrictions et les peurs qui peuvent être surmontées avec le temps et l'effort.</p>"
      );
      // Affichage de la fiche descriptive Saturne
      descriptionSaturne.style("display", "block");

      //Bouton fermer Saturne
      descriptionSaturne
        .append("button")
        .style("border", "1px solid peru")
        .style("border-radius", "15px")
        .style("background-color", "white")
        .style("color", "peru")
        .attr("id", "close")
        .text("Fermer")
        .on("click", function () {
          descriptionSaturne.style("display", "none");
          planetSaturne.transition().duration(1000).attr("r", 10);
        });
      //Bouton en savoir plus Saturne
      descriptionSaturne
        .append("button")
        .style("border", "1px solid peru")
        .style("border-radius", "15px")
        .style("background-color", "white")
        .style("color", "peru")
        .attr("id", "close")
        .text("En savoir plus")
        .on("click", function () {
          //Affichage de la fiche astrologique  Saturne
          description2Saturne.html(
            "<h4>Signification</h4><p>La responsabilité</p>" +
              "<h4>Symbole</h4><p>L'ambition</p>" +
              "<h4>Elément</h4><p>Associée à la terre</p>" +
              "<h4>Couleur</h4><p>Noir et marron foncé</p>"
          );

          //Bouton fermer fiche astrologique Saturne
          description2Saturne.style("display", "block");
          description2Saturne
            .append("button")
            .attr("id", "close")
            .style("border", "1px solid peru")
            .style("border-radius", "15px")
            .style("background-color", "white")
            .style("color", "peru")
            .text("Fermer")
            .on("click", function () {
              description2Saturne.style("display", "none");
              descriptionSaturne.style("display", "none");
              planetSaturne.transition().duration(1000).attr("r", 10);
            });
        });
    }, 1000);
    //Fin du premier Saturne on click
  });

  //--FICHE DESCRIPTIVE URANUS --//
  //Description Uranus
  var descriptionUranus = select("#Description1")
    .append("div")
    .attr("id", "description")
    .style(
      "background-image",
      "linear-gradient(to right, paleturquoise, lightskyblue )"
    )
    .style("border", "none")
    .style("padding", "10px")
    .style("display", "none")
    .style("position", "absolute")
    .style("left", `${width / 36}px`) // position horizontale centrée par rapport au cercle du Soleil
    .style("top", `${height / 2 + 183.5}px`); // position verticale en dessous du cercle du Soleil

  //Fiche astrologique Uranus
  var description2Uranus = select("#Description2")
    .append("div")
    .attr("id", "description")
    .style(
      "background-image",
      "linear-gradient(to right, paleturquoise, lightskyblue)"
    )
    .style("border", "none")
    .style("padding", "200px")
    .style("display", "none")
    .style("position", "absolute")
    .style("left", `${width / 2 + 200}px`) // position horizontale centrée par rapport au cercle du Soleil
    .style("top", `${height / 14}px`); // position verticale en dessous du cercle du Soleil

  //--INTERACTION URANUS & BOUTONS--//

  //récupérer la planète Uranus
  var planetUranus = select("#Uranus");

  planetUranus.on("click", function () {
    planetUranus.transition().duration(1000).attr("r", 100);
    //Affichage de la fiche descriptive de Uranus
    setTimeout(function () {
      descriptionUranus.html(
        "<h2>Uranus</h2><p> Uranus en astrologie est souvent associée à l'originalité, à l'indépendance, à la rébellion et au changement.  </p>" +
          "<p>  Uranus est également considérée comme étant la planète de l'innovation, de l'invention et de l'avant-garde.</p>"
      );
      // Mise à jour du contenu de la fiche descriptive avec les informations de Uranus
      descriptionUranus.html(
        "<h2>Uranus</h2><p> Uranus en astrologie est souvent associée à l'originalité, à l'indépendance, à la rébellion et au changement.  </p>" +
          "<p>  Uranus est également considérée comme étant la planète de l'innovation, de l'invention et de l'avant-garde.</p>"
      );
      // Affichage de la fiche descriptive Uranus
      descriptionUranus.style("display", "block");

      //Bouton fermer Uranus
      descriptionUranus
        .append("button")
        .style("border", "1px solid lightskyblue")
        .style("border-radius", "15px")
        .style("background-color", "white")
        .style("color", "lightskyblue")
        .attr("id", "close")
        .text("Fermer")
        .on("click", function () {
          descriptionUranus.style("display", "none");
          planetUranus.transition().duration(1000).attr("r", 10);
        });
      //Bouton en savoir plus Uranus
      descriptionUranus
        .append("button")
        .style("border", "1px solid lightskyblue")
        .style("border-radius", "15px")
        .style("background-color", "white")
        .style("color", "lightskyblue")
        .attr("id", "close")
        .text("En savoir plus")
        .on("click", function () {
          //Affichage de la fiche astrologique  Uranus
          description2Uranus.html(
            "<h4>Signification</h4><p>Les idéaux</p>" +
              "<h4>Symbole</h4><p>Création et originalité</p>" +
              "<h4>Elément</h4><p>Associée à l'air</p>" +
              "<h4>Couleur</h4><p>Bleu électrique et turquoise</p>"
          );

          //Bouton fermer fiche astrologique Uranus
          description2Uranus.style("display", "block");
          description2Uranus
            .append("button")
            .attr("id", "close")
            .style("border", "1px solid lightskyblue")
            .style("border-radius", "15px")
            .style("background-color", "white")
            .style("color", "lightskyblue")
            .text("Fermer")
            .on("click", function () {
              description2Uranus.style("display", "none");
              descriptionUranus.style("display", "none");
              planetUranus.transition().duration(1000).attr("r", 10);
            });
        });
    }, 1000);
    //Fin du premier Uranus on click
  });

  //--FICHE DESCRIPTIVE NEPTUNE --//
  //Description Neptune
  var descriptionNeptune = select("#Description1")
    .append("div")
    .attr("id", "description")
    .style(
      "background-image",
      "linear-gradient(to right, slateblue, darkslateblue  )"
    )
    .style("border", "none")
    .style("padding", "10px")
    .style("display", "none")
    .style("position", "absolute")
    .style("left", `${width / 36}px`) // position horizontale centrée par rapport au cercle du Soleil
    .style("top", `${height / 2 + 183.5}px`); // position verticale en dessous du cercle du Soleil

  //Fiche astrologique Neptune
  var description2Neptune = select("#Description2")
    .append("div")
    .attr("id", "description")
    .style(
      "background-image",
      "linear-gradient(to right, slateblue, darkslateblue)"
    )
    .style("border", "none")
    .style("padding", "200px")
    .style("display", "none")
    .style("position", "absolute")
    .style("left", `${width / 2 + 200}px`) // position horizontale centrée par rapport au cercle du Soleil
    .style("top", `${height / 14}px`); // position verticale en dessous du cercle du Soleil

  //--INTERACTION NEPTUNE & BOUTONS--//

  //récupérer la planète Neptune
  var planetNeptune = select("#Neptune");

  planetNeptune.on("click", function () {
    planetNeptune.transition().duration(1000).attr("r", 100);
    //Affichage de la fiche descriptive de Neptune
    setTimeout(function () {
      descriptionNeptune.html(
        "<h2>Neptune</h2><p> Neptune est associée à l'imagination, à l'intuition, à l'inspiration et au mysticisme.  </p>" +
          "<p>  Neptune est également associée à l'inspiration artistique, à la musique,</p>" +
          "<p> à la poésie, à la danse et à la spiritualité.</p>"
      );
      // Mise à jour du contenu de la fiche descriptive avec les informations de Neptune
      descriptionNeptune.html(
        "<h2>Neptune</h2><p> Neptune est associée à l'imagination, à l'intuition, à l'inspiration et au mysticisme.  </p>" +
          "<p>  Neptune est également associée à l'inspiration artistique, à la musique,</p>" +
          "<p> à la poésie, à la danse et à la spiritualité.</p>"
      );
      // Affichage de la fiche descriptive Neptune
      descriptionNeptune.style("display", "block");

      //Bouton fermer Neptune
      descriptionNeptune
        .append("button")
        .style("border", "1px solid darkslateblue")
        .style("border-radius", "15px")
        .style("background-color", "white")
        .style("color", "darkslateblue")
        .attr("id", "close")
        .text("Fermer")
        .on("click", function () {
          descriptionMars.style("display", "none");
          planetMars.transition().duration(1000).attr("r", 10);
        });
      //Bouton en savoir plus Neptune
      descriptionNeptune
        .append("button")
        .style("border", "1px solid darkslateblue")
        .style("border-radius", "15px")
        .style("background-color", "white")
        .style("color", "darkslateblue")
        .attr("id", "close")
        .text("En savoir plus")
        .on("click", function () {
          //Affichage de la fiche astrologique  Neptune
          description2Neptune.html(
            "<h4>Signification</h4><p>Les rêves</p>" +
              "<h4>Symbole</h4><p>Imagination et spiritualité</p>" +
              "<h4>Elément</h4><p>Associée à l'eau</p>" +
              "<h4>Couleur</h4><p>Bleu marine et violet</p>"
          );

          //Bouton fermer fiche astrologique Neptune
          description2Neptune.style("display", "block");
          description2Neptune
            .append("button")
            .attr("id", "close")
            .style("border", "1px solid darkslateblue")
            .style("border-radius", "15px")
            .style("background-color", "white")
            .style("color", "darkslateblue")
            .text("Fermer")
            .on("click", function () {
              description2Neptune.style("display", "none");
              descriptionNeptune.style("display", "none");
              planetNeptune.transition().duration(1000).attr("r", 10);
            });
        });
    }, 1000);
    //Fin du premier Neptune on click
  });

  //Fin traitement données
});
