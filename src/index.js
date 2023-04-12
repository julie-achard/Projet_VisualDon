import { csv } from "d3-fetch";
import { select, selectAll } from "d3-selection";
import { mean } from "d3-array";
// Pour importer les données (@rollup/plugin-dsv)
import planets from "../data/planets.csv";

csv("../data/planets.csv").then(function (data) {
  data.map(
    (d) => (
      (d.Planet = d.Planet),
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
