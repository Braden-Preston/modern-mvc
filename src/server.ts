import fastify from "fastify";
import handlebars from "handlebars";
import viewEngine from "point-of-view";
import fastifyStatic from "fastify-static";

let resolve = (p: string) => new URL(p, import.meta.url).pathname;

const app = fastify();

app.register(viewEngine, {
  engine: { handlebars },
  viewExt: "hbs",
  root: "./src/views",
  propertyName: "view",
  layout: "layouts/main.hbs",
  includeViewExtension: true,
  defaultContext: {
    title: "My Vite Site",
  },
});

app.register(fastifyStatic, {
  root: resolve("../public"),
});

// Declare a route
app.get("/", function (req, res) {
  // res.send({ hello: "world" });
  res.view("home");
});

if (import.meta.env.PROD) {
  app.listen(3000);
}

export const viteNodeApp = app;
