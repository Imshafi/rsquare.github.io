const router = require("express").Router();
const image = require("../models/images");
const jwt = require('jsonwebtoken');

router.post("/", async (req, res) => {
    let token = null;
	try {
		if( !req.body.token )
            return res.status(400).send({ message: "Invalid token" });
        token = await jwt.verify(req.body.token,process.env.JWTPRIVATEKEY);

        if( token == null )
            return res.status(400).send({ message: "Invalid token" });

		const images = await image.findOne({ userId:token._id });
		if (!images)
			return res.status(401).send({ message: "No Images found in db." });

		res.status(200).send({ images: images.images });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;