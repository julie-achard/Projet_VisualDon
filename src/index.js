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
      (d.Planet = d.Planet),
      (d.color = +d.color),
      (d.Mass = +d.Mass),
      (d.Density = +d.Density),
      (d.Diameter = d.Diameter),
      (d.Surface_gravity = +d.Surface_gravity),
      (d.Distance_from_sun = +d.Distance_from_sun)
    )
  );
  console.log(data);
});
//Dessin
const width = 1000;
const height = 800;
const svg = d3
  .select("#container")
  .append("svg")
  .attr("width", width)
  .attr("height", height);
//Dessin du soleil
d3.csv("../data/planets.csv").then((data) => {
  const sun = svg
    .append("circle")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", 50)
    .attr("fill", "yellow");

  const planets = data.map((planet) => ({
    name: planet.Planet,
    distance: +planet.Distance_from_sun * (10 ^ 6),
    size: +planet.Diameter / 10000,
    color: planet.Color,
  }));

  //Rectangle descriptif
  var description = d3
    .select("body")
    .append("div")
    .attr("id", "description")
    .style("background-color", "grey")
    .style("border", "1px solid grey")
    .style("padding", "10px")
    .style("display", "none")
    .style("position", "absolute")
    .style("left", `${width / 2 - 100}px`) // position horizontale centrée par rapport au cercle du Soleil
    .style("top", `${height / 2 + 70}px`); // position verticale en dessous du cercle du Soleil

  // Ajout d'un événement click au cercle du Soleil pour afficher la fiche descriptive
  sun.on("click", function () {
    // Mise à jour du contenu de la fiche descriptive avec les informations du Soleil
    description.html(
      "<h2>Description du Soleil</h2><p>Le Soleil est une étoile de type G2 qui se trouve au centre de notre système solaire.</p><p>C'est la source de chaleur et de lumière qui permet la vie sur Terre.</p>"
    );
    // Affichage de la fiche descriptive
    description.style("display", "block");
  });

  //Pour créer les autres planètes en fonction de leur distance respective mais ça ne fonctionne pas
  planets.forEach((planet) => {
    const orbit = svg
      .append("path")
      .datum({
        innerRadius: planet.distance - 10,
        outerRadius: planet.distance + 10,
      })
      .attr(
        "d",
        d3
          .arc()
          .innerRadius((d) => d.innerRadius)
          .outerRadius((d) => d.outerRadius)
          .startAngle(0)
          .endAngle(2 * Math.PI)
      )
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 1);

    const circle = svg
      .append("circle")
      .datum(planet)
      .attr("cx", width / 2)
      .attr("cy", height / 2 - planet.distance)
      .attr("r", planet.size / 2)
      .attr("fill", planet.color).call;
  });
});
