import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import fs from "fs"

const app = express();
// Para que nuestro servidor express pueda interpretar en forma automática mensajes de tipo JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const chatFilePath = './chat.txt';

const PORT = 8080;
// Configuración de handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  res.render("index");
});

const httpServer = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});

// Configuración de socket

let messages = [];
const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log(`Nuevo cliente conectado con el id ${socket.id}`);

  socket.on("newUser", (data) => {
    socket.broadcast.emit("newUser", data);
  });

 socket.on('disconnect', () => {
  console.log('Un usuario se desconectó');
 });
  socket.on("message", (data) => {
    messages.push(data);
      
    io.emit("messageLogs", messages);
  })

process.on('SIGINT', () => {
  console.log('\nGuardando mensajes en archivo...');

  fs.writeFile('chat-log.json', JSON.stringify(messages, null, 2), (err) => {
      if (err) {
          console.error('Error al guardar el archivo:', err);
      } else {
          console.log('Mensajes guardados exitosamente en chat-log.json');
      }
      process.exit();
  });
});
});
