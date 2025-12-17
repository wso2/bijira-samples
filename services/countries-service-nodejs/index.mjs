import app from "./app.mjs";

const PORT = Number.parseInt(process.env.PORT ?? "8080", 10);
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`countries-service-nodejs listening on port ${PORT}`);
});


