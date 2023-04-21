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
    .style("background-image", "linear-gradient(to right, khaki, sandybrown )")
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
    .style("background-image", "linear-gradient(to right, sandybrown , khaki)")
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
        "<h2>Le Soleil</h2><p> Il est souvent considérée comme le cœur du thème astral.Il représente l'essence de notre être,notre identité et notre volonté de vivre.</p>" +
          "<p>Il est également considéré comme la source</p>" +
          "<br>" +
          "<p>de notre énergie vitale de notre motivation et de notre rayonnement personnel.</p>"
      );
      // Mise à jour du contenu de la fiche descriptive avec les informations de Mercure
      descriptionMercure.html(
        "<h2>Le Soleil</h2><p> Il est souvent considérée comme le cœur du thème astral. Il représente l'essence de notre être,</p><p>notre identité et notre volonté de vivre. Il est également considéré comme la source de notre énergie vitale,</p><p>de notre motivation et de notre rayonnement personnel.</p>"
      );
      // Affichage de la fiche descriptive Mercure
      descriptionMercure.style("display", "block");

      //Bouton fermer Mercure
      descriptionMercure
        .append("button")
        .style("border", "1px solid sandybrown")
        .style("border-radius", "15px")
        .style("background-color", "white")
        .style("color", "sandybrown")
        .attr("id", "close")
        .text("Fermer")
        .on("click", function () {
          descriptionMercure.style("display", "none");
          planet.Mercury.transition().duration(1000).attr("r", 10);
        });
      //Bouton en savoir plus Mercure
      descriptionMercure
        .append("button")
        .style("border", "1px solid sandybrown")
        .style("border-radius", "15px")
        .style("background-color", "white")
        .style("color", "sandybrown")
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
            .style("border", "1px solid sandybrown")
            .style("border-radius", "15px")
            .style("background-color", "white")
            .style("color", "sandybrown")
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
  //Fin traitement données
});
