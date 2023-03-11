const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    let firstName = req.body.fName;
    let lastName = req.body.lName;
    let email = req.body.email;

    let data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                },
            },
        ],
    };

    const jsonData = JSON.stringify(data);
    const apiKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-usx";
    const listId = "xxxxxxxxxx";
    const url = "https://us9.api.mailchimp.com/3.0/lists/" + listId;
    const options = {
        method: "POST",
        auth: "auth:" + apiKey,
    };

    const request = https.request(url, options, function (response) {
        response.statusCode === 200
            ? res.sendFile(__dirname + "/success.html")
            : res.sendFile(__dirname + "/failure.html");

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function (req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000");
});
