import { csv } from "d3-fetch";
import { select, selectAll } from "d3-selection";
import { mean } from "d3-array";
import { scaleLinear } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { transition } from "d3-transition";
import { easeLinear } from "d3-ease";
import { arc } from "d3-shape";
import { interpolate } from "d3-interpolate";
import { format } from "d3-format";
import { timeParse } from "d3-time-format";

// Pour importer les données (@rollup/plugin-dsv)
import planets from "../data/planets.csv";
//Trier les données
d3.csv("../data/planets.csv").then(function (data) {
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
    distance: planet.Distance_from_sun * 3,
    size: planet.Diameter / 300,
    color: planet.Color,
  }));

  //Dessin
  // Création du SVG pour avoir toutes les planètes
  const width = 1000;
  const height = 800;
  const svg = d3
    .select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  //Rectangle descriptif
  var description = d3
    .select("#SunDescription")
    .append("div")
    .attr("id", "description")
    .style("background-color", "black")
    .style("border", "1px solid white")
    .style("padding", "10px")
    .style("display", "none")
    .style("position", "absolute")
    .style("left", `${width / 2 - 100}px`) // position horizontale centrée par rapport au cercle du Soleil
    .style("top", `${height / 2 + 70}px`); // position verticale en dessous du cercle du Soleil

  console.log(planets);
  //Pour créer les autres planètes en fonction de leur distance respective mais ça ne fonctionne pas
  planets.forEach((planet, index) => {
    // Create orbits center on the sun
    const orbit = svg
      .append("circle")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", planet.distance)
      .attr("fill", "none")
      .attr("stroke", "grey")
      .attr("stroke-dasharray", "5,5");

    //Create the sun
    const soleil = svg
      .append("circle")
      .attr("id", "Sun")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("r", 20)
      .attr("fill", "yellow");

    // Ajout d'un événement click au cercle du Soleil pour afficher la fiche descriptive
    soleil.on("click", function () {
      // Mise à jour du contenu de la fiche descriptive avec les informations du Soleil
      description.html(
        "<h2>Description du Soleil</h2><p>Le Soleil est une étoile de type G2 qui se trouve au centre de notre système solaire.</p><p>C'est la source de chaleur et de lumière qui permet la vie sur Terre.</p>"
      );
      // Affichage de la fiche descriptive
      description.style("display", "block");
    });

    // Create planets on the orbits
    svg
      .append("circle")
      .attr("id", planet.name)
      .attr("cx", width / 2 + planet.distance)
      .attr("cy", height / 2)
      .attr("r", planet.size) // planet.size for real size
      .attr("fill", planet.color)
      .attr("stroke", "white");
  });
});
