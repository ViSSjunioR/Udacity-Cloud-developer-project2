import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Filter image and send to user.
  app.get("/filteredimage", async (req, res) => {
    const imageUrl = req.query.image_url;

    try {
      const resValidateImageUrl = await axios.head(imageUrl);
      const contentType = resValidateImageUrl.headers["content-type"];

      if (contentType.startsWith("image/")) {
        const filteredImage = await filterImageFromURL(imageUrl);
        res.set("Content-Type", "image/jpg");
        res.status(200).sendFile(filteredImage, () => {
          // Delete local image after send to user
          deleteLocalFiles([filteredImage]);
        });
      } else {
        res.status(400).send("Url is not valid image url!");
      }
    } catch (er) {
      res.status(400).send("invalid image url!");
    }
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
