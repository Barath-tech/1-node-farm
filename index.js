const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemp = require("./modules/replaceTemplate.js");
/////////////////

//FILES

//Blocking feature-Synchronous
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `This is the output file and the news about avacardo is ${textIn}.\n This is created at ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File written!!");

//Non-blocking Asynchronous
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   console.log("ERROR");
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("Your file has been written checkout!!!");
//       });
//     });
//   });
// });
///////////////////

//SERVER

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);
//console.log(dataObj);
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  //console.log(url.parse(req.url, true));
  //overview
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHtml = dataObj.map((el) => replaceTemp(tempCard, el)).join("");
    //console.log(cardsHtml);
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);
  }
  //product
  else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemp(tempProduct, product);
    res.end(output);
  }
  //api
  else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>Page Not Found!!</h1>");
  }
  //   res.end("Hello from the server!!");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
