import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import express from "express"; // Make sure to import express
import path from "path";
import { fileURLToPath } from "url";

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Import your Room files
 */
import { GameRoom } from "./rooms/GameRoom.js";

export default config({
    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        
        // Define our game rooms
        gameServer.define('lobby', GameRoom, {
            roomType: "lobby",
            maxClients: 100
        });
        
        gameServer.define('dungeon', GameRoom, {
            roomType: "dungeon",
            maxClients: 4
        });
    },

    initializeExpress: (app) => {
        /**
         * Bind your custom express routes here
         */
        // Explicitly serve static files from public directory
        app.use(express.static(path.join(__dirname, "../../public")));
        
        // Route for the game client
        app.get("/", (req, res) => {
            res.sendFile(path.join(__dirname, "../../public/index.html"));
        });
        
        app.get("/hello_world", (req, res) => {
            res.send("It's time to kick ass and chew bubblegum!");
        });

        // Add a simple API endpoint for game info
        app.get("/game_info", (req, res) => {
            res.json({
                name: "Gons",
                version: "0.1.0",
                status: "development"
            });
        });

        /**
         * Use @colyseus/playground
         */
        if (process.env.NODE_ENV !== "production") {
            app.use("/playground", playground());
        }

        /**
         * Bind @colyseus/monitor
         */
        app.use("/monitor", monitor());
    },

    beforeListen: () => {
        /**
         * Before gameServer.listen() is called.
         */
        console.log("Starting Gons server...");
    }
});