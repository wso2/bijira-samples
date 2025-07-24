import app from "./app.mjs";

const PORT = parseInt(process.env.PORT) || 3002;

app.listen(PORT, () => {
  console.log(`Accounts service running at http://localhost:${PORT}`);
});