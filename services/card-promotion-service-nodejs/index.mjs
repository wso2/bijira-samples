import app from "./app.mjs";

const PORT = 3005;

app.listen(PORT, () => {
  console.log(`Notification service running at http://localhost:${PORT}`);
});