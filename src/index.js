import { csv } from "d3-fetch";
import { select } from "d3-selection";
import { mean } from "d3-array";

select("body").append("div").attr("id", "monSvg");
select("#monSvg").append("svg").attr("width", "500").attr("height", "500");

const dessin = select("svg");

d3.csv("../data/planets.csv").then(function (data) {
  data.map(
    (d) => (
      (d.Planet = +d.Planet),
      (d.color = +d.color),
      (d.Mass = +d.Mass),
      (d.Density = +d.Density),
      (d.Diameter = +d.Diameter),
      (d.Surface_gravity = +d.Surface_gravity),
      (d.Distance_from_sun = +d.Distance_from_sun)
    )
  );

  console.log(data);
});

//   dessin
//     .selectAll("rect")
//     .data(cleanData)
//     .join((enter) =>
//       enter
//         .append("g")
//         .append("rect")
//         .attr("width", "20")
//         .attr("height", (d) => d.Planet)
//         .attr("x", (d, i) => i * 30)
//         .attr("y", (d) => 500 - d * 10)

//Visualiser les données
//Créer un svg
