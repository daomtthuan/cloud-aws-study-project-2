import bodyParser from 'body-parser';
import express, {
  Request,
  Response,
} from 'express';

import {
  deleteLocalFiles,
  filterImageFromURL,
} from './util/util';

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // GET /filteredimage?image_url={{URL}}
  app.get("/filteredimage", async (req: Request, res: Response) => {
    try {
      console.log("Get URL image");
      const absolutePath: string = await filterImageFromURL(req.query.image_url as string);

      return res.status(200).sendFile(absolutePath, async (err) => {
        console.log("File downloaded");

        if (!err) {
          await deleteLocalFiles([absolutePath]);
          console.log("File deleted");
        }
      });
    } catch (e) {
      return res.status(500).send(e);
    }
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (_req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
