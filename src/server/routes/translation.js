const deepl = require('deepl-node');
const express = require("express");
const router = express.Router();

const translator = new deepl.Translator(process.env.DEEPL_KEY);

router.post("/", async (req, res) => {
    try {
        const {text} = req.body;
        const trimed = text?.trim()
        if (!trimed) {
            return res.sendStatus(400)
        }
        const result = await translator.translateText(trimed, null, 'EN-GB');
        if (result.text) {
            res.send(result.text);
        }
        console.log(result)
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

module.exports = router;
