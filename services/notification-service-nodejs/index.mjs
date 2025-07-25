import app from "./app.mjs";

const PORT = parseInt(process.env.PORT) || 3003;

app.listen(PORT, () => {
  console.log(`Notification service running at http://localhost:${PORT}`);
});