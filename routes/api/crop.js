const express = require('express');
const router = express.Router();
const { spawn } = require("child_process");

router.post("/predict", (req, res) => {
    try {
        const { Nitrogen, Phosporus, Potassium, Temperature, Humidity, pH, Rainfall } = req.body;
        const python_process = spawn("python", ["ml-model/predict.py", Nitrogen, Phosporus, Potassium, Temperature, Humidity, pH, Rainfall]);

        python_process.stdout.on("data", (data) => { res.send(data.toString().trim().replace(/^./, c => c.toUpperCase())); });
        python_process.stderr.on("data", (data) => { res.send(`Error: ${data.toString()}`); });
    } catch (error) {
        res.send(`Error: ${error.message}`);
    }
});

module.exports = router;