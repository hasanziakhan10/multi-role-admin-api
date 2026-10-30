const { app, initializeDatabase } = require("./app");

const PORT = process.env.PORT || 5000;

initializeDatabase()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Application startup failed:", error.message);
    process.exit(1);
  });