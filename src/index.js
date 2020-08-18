const express = require("express");

const app = express();

let projects = ["Project 1", "Project 2", "Project 3", "Project 4"];

app.get("/", (request, response) => {
  return response.json({ message: "Hello World" });
});

app.get("/projects", (request, response) => {
  return response.json(projects);
});

app.post("/projects", (request, response) => {
  projects.push("Project 5");
  return response.json(projects);
});

app.put("/projects/:id", (request, response) => {
  const { id } = request.params;
  projects[id] = `Project ${id} edit`;
  return response.json(projects);
});

app.delete("/projects/:id", (request, response) => {
  const { id } = request.params;
  projects = projects.filter((project, index) => {
    console.log({ index, id });
    return index != id;
  });
  return response.json(projects);
});

app.listen(3333, () => {
  console.log("🚀️ Back-end started!");
});
