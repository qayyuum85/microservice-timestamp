const http = require("http");
const fs = require("fs");

const getTimeStamps = date => ({
  unix: date.getTime(),
  utc: date.toUTCString()
});

const requestHandler = (req, res) => {
  if (req.url === "/") {
    fs.readFile("views/index.html", "utf8", (err, html) => {
      if (err) {
        throw err;
      }

      res.writeHead(200, { ContentType: "text/html" });
      res.end(html);
    });
  } else if (req.url.startsWith("/api/timestamp")) {
    const dateString = req.url.split("/api/timestamp")[1];
    let timestamp;

    if (dateString === undefined || dateString.trim() === "") {
      timestamp = getTimeStamps(new Date());
    } else {
      const date = !isNaN(dateString)
        ? new Date(parseInt(dateString))
        : new Date(dateString);

      if (!isNaN(date.getTime())) {
        timestamp = getTimeStamps(date);
      } else {
        timestamp = {
          error: "Invalid data"
        };
      }
    }

    res.writeHead(200, { ContentType: "application/json" });
    res.end(JSON.stringify(timestamp));
  } else {
    fs.readFile("views/404.html", (err, html) => {
      if (err) {
        throw err;
      }

      res.writeHead(200, {
        ContentType: "text/html"
      });
      res.end(html);
    });
  }
};

const server = http.createServer(requestHandler);

server.listen(process.env.PORT || 4100, err => {
  if (err) {
    throw err;
  }
  console.log(`Server running on PORT ${server.address().port}`);
});
