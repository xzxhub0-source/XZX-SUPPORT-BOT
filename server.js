import http from "http";

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("XZX bot alive");
});

server.listen(PORT, () => {
  console.log(`🌐 Keep-alive server running on port ${PORT}`);
});
