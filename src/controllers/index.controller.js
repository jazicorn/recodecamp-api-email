//const { Request, Response } = require("express");
//const router = require("express-promise-router")();

const helloWorld = async (req, res) => {
    switch(req.method) {
        case('GET'):
                try {
                const data = await { data: "Hello World!" };
                return res.status(200).send(data);
            } catch {
                return res.status(500).send({ error: "Something went wrong"});
            }
            break
        default:
            return res.status(400).send({ error: `${req.method} Method Not Allowed` });
    };
};

module.exports = {
  helloWorld
};
