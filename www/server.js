"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const axios_1 = __importDefault(require("axios"));
const util_1 = require("./util/util");
(() => __awaiter(void 0, void 0, void 0, function* () {
    // Init the Express application
    const app = (0, express_1.default)();
    // Set the network port
    const port = process.env.PORT || 8082;
    // Use the body parser middleware for post requests
    app.use(body_parser_1.default.json());
    // Root Endpoint
    // Displays a simple message to the user
    app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.send("try GET /filteredimage?image_url={{}}");
    }));
    // Filter image and send to user.
    app.get("/filteredimage", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const imageUrl = req.query.image_url;
        try {
            const resValidateImageUrl = yield axios_1.default.head(imageUrl);
            const contentType = resValidateImageUrl.headers["content-type"];
            if (contentType.startsWith("image/")) {
                const filteredImage = yield (0, util_1.filterImageFromURL)(imageUrl);
                res.set("Content-Type", "image/jpg");
                res.status(200).sendFile(filteredImage, () => {
                    // Delete local image after send to user
                    (0, util_1.deleteLocalFiles)([filteredImage]);
                });
            }
            else {
                res.status(400).send("Url is not valid image url!");
            }
        }
        catch (er) {
            res.status(400).send("invalid image url!");
        }
    }));
    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
}))();
//# sourceMappingURL=server.js.map