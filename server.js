// core module
const http = require("http");
const fs = require("fs");
const url = require("url");

// user define module

// third part modules

// reading files
let human = JSON.parse(fs.readFileSync("./peoples.json", "utf-8"));
let htmlFile = fs.readFileSync("./paul.html", "utf-8");
let humanData = fs.readFileSync("./rael.html", "utf-8");

// useble function
const humanDetails = (template, peoples) => {
  let output = template.replace("{{%NAME%}}", peoples.name);
  output = output.replace("{{%LOCATION%}}", peoples.location);
  output = output.replace("{{%RULE%}}", peoples.Rule);
  output = output.replace("{{%ID%}}", peoples.id);
  output = output.replace("{{%IMAGE}}", peoples.image);
  output = output.replace("{{%ABOUT%}}", peoples.about);

  return output;
};
// server
const server = http.createServer((req, res) => {
  let { query, pathname: path } = url.parse(req.url, true);
  if (path === "/" || path === "/home") {
    if (!query.id) {
      let peoples = human.map((person) => {
        return humanDetails(htmlFile, person);
      });
      res.writeHead(200, { "Content-Type": "text/html" })
      res.end(peoples.join(","));
    } else {
      let data = human[query.id];
      let replaceHTML = humanDetails(humanData, data);
      res.end(replaceHTML);
    }
  }
});
server.listen(8080, () => {
  console.log("Server is listen on port 8080....");
});
