import express from "express";
import cors from "cors";

const app = express();

// Commented because I use Vercel. If not Vercel, this code is necessary.
// const PORT = process.env.PORT || 3000;

app.use(
    cors({
        origin: "http://localhost:3000", // Development URL
        // origin: "https://box-visualizer.vercel.app", // Frontend URL
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type"],
    }),
);
app.use(express.json());

// GET route for root
app.get("/", (req: any, res: any) => {
    res.send("This is the Box Triangulation API");
});

// POST route for /box
app.post("/box", (req: any, res: any) => {
    const { length, width, height } = req.body;

    if (length === undefined || width === undefined || height === undefined) {
        return res.status(400).json({ error: "Missing parameters" });
    }

    // Ensure the parameters are numbers
    const len = Number(length);
    const wid = Number(width);
    const hei = Number(height);

    if (isNaN(len) || isNaN(wid) || isNaN(hei)) {
        return res.status(400).json({ error: "Parameters must be numbers" });
    }

    // Compute the triangulation
    const data = computeBoxTriangulation(len, wid, hei);
    res.json(data);
});

// Commented because I use Vercel. Vercel handles the server. If not Vercel, this code is necessary.
// app.listen(PORT, () => {
//     console.log(`Environment PORT: ${process.env.PORT}`);
//     console.log(`Server is running on port ${PORT}`);
// });

function computeBoxTriangulation(
    length: number,
    width: number,
    height: number,
) {
    // Define the 8 vertices of the box
    const vertices = [
        [0, 0, 0], // 0
        [width, 0, 0], // 1
        [width, height, 0], // 2
        [0, height, 0], // 3
        [0, 0, length], // 4
        [width, 0, length], // 5
        [width, height, length], // 6
        [0, height, length], // 7
    ];

    // Define the 12 triangles (2 per face)
    const triangles = [
        // Bottom face
        [0, 1, 2],
        [0, 2, 3],

        // Top face
        [4, 5, 6],
        [4, 6, 7],

        // Front face
        [0, 1, 5],
        [0, 5, 4],

        // Right face
        [1, 2, 6],
        [1, 6, 5],

        // Back face
        [2, 3, 7],
        [2, 7, 6],

        // Left face
        [3, 0, 4],
        [3, 4, 7],
    ];

    return { vertices, triangles };
}