import app from "./app.mjs";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Accounts service running at http://localhost:${PORT}`);
});