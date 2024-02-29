const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 5001;
app.use(cors());
const sentimentRouter = require("./sentimentRouter");

app.use("/", sentimentRouter);

app.use(express.json());

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
