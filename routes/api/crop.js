const express = require('express');
const router = express.Router();
const { spawn } = require("child_process");

router.post("/predict", (req, res) => {
    try {
        const { Nitrogen, Phosporus, Potassium, Temperature, Humidity, pH, Rainfall } = req.body;

        const pythonProcess = spawn("python", ["ml-model/predict.py", Nitrogen, Phosporus, Potassium, Temperature, Humidity, pH, Rainfall]);

        pythonProcess.stdout.on("data", (data) => {
            res.send(data.toString().trim().replace(/^./, c => c.toUpperCase()));
        });

        pythonProcess.stderr.on("data", (data) => {
            res.send(`Error: ${data.toString()}`);
        });
    } catch (error) {
        res.send(`Error: ${error.message}`);
    }
});

module.exports = router;