const express = require("express");
const { uuid, isUuid } = require("uuidv4");

const app = express();
app.use(express.json());

// Middlewares

function logRequest(request, response, next) {
  const { method, url } = request;
  const logDescription = `[${method.toUpperCase()}] ${url}`;
  console.log(logDescription);
  console.time(logDescription);
  next();
  console.timeEnd(logDescription);
}

function validateProjectId(request, response, next) {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid project ID." });
  }
  return next();
}

function otherWayExecuteMiddleware(request, response, next) {
  console.log("otherWayExecuteMiddleware");
  return next();
}

app.use(logRequest);

// running only routes with id in projects
app.use("/projects/:id", otherWayExecuteMiddleware);

// -- Middlewares

const projects = [];

app.get("/projects", (request, response) => {
  const { title } = request.query;

  const results = title
    ? projects.filter((project) =>
        project.title.toLowerCase().includes(title.toLowerCase())
      )
    : projects;

  return response.json(results);
});

app.post("/projects", (request, response) => {
  const { title, owner } = request.body;

  if (!title || !owner) {
    return response
      .status(400)
      .json({ error: "Title and owner required in project" });
  }

  const project = {
    id: uuid(),
    title,
    owner,
  };

  projects.push(project);
  return response.status(201).json(project);
});

app.put("/projects/:id", validateProjectId, (request, response) => {
  const { id } = request.params;
  const { title, owner } = request.body;
  const projectIndex = projects.findIndex((project) => project.id == id);
  if (projectIndex < 0) {
    return response.status(400).json({ error: "Project not found" });
  }

  const project = {
    id,
    title,
    owner,
  };
  projects[projectIndex] = project;
  return response.json(project);
});

app.delete("/projects/:id", validateProjectId, (request, response) => {
  const { id } = request.params;
  const projectIndex = projects.findIndex((project) => project.id == id);
  if (projectIndex < 0) {
    return response.status(400).json({ error: "Project not found" });
  }

  projects.splice(projectIndex, 1);
  return response.status(204).send();
});

app.listen(3333, () => {
  console.log("🚀️ Back-end started!");
});
