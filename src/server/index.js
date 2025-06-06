// default export
const express = require("express");
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5001

app.use(express.json());
app.use(cors());

const db = require("./models");

// Routers
const silentResponseRouter = require('./routes/SilentResponse');
app.use("/SilentResponse", silentResponseRouter);

const feedbackRouter = require('./routes/feedbackRoutes');
app.use("/api/feedback", feedbackRouter);

const translationRouter = require('./routes/translation');
app.use("/api/translate", translationRouter);

const authRouter = require('./routes/authentication');
app.use("/api/auth", authRouter);

const courseAdminRouter = require('./routes/courseAdmin');
app.use("/api/admin", courseAdminRouter);

const studentRouter = require("./routes/studentAdmin");
app.use("/api/student", studentRouter);

// listen to the server
db.sequelize.sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`server running on port ${port}`);
    });
  })
  .catch((error => {
    console.error("Database sync failed:", error);
    process.exit(1);
  }))
