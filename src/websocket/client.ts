import { io } from "../http";
import { ConnectionsService } from "../services/ConnectionsService";
import { UsersService } from "../services/UsersService";
import { MessagesService } from "../services/MessagesService";

// Se recebermos qualquer outra coisa que não não text e email vai dar erro
interface IParams {
  text: string;
  email: string;
}

io.on("connect", (socket) => {
  const connectionsService = new ConnectionsService();
  const usersService = new UsersService();
  const messagesService = new MessagesService();

  socket.on("client_first_access", async (params) => {
    const socket_id = socket.id;
    const { text, email } = params as IParams;
    let user_id = null;

    const userExists = await usersService.findByEmail(email);

    if (!userExists) {
      // aqui não tem conexão criada
      const user = await usersService.create(email);

      await connectionsService.create({
        socket_id,
        user_id: user.id,
      });

      user_id = user.id;
    } else {
      user_id = userExists.id;

      const connection = await connectionsService.findByUserId(userExists.id);

      // O usuário pode ter sido criado de uma outra forma diferente do WS
      if (!connection) {
        await connectionsService.create({
          socket_id,
          user_id: userExists.id,
        });
      } else {
        connection.socket_id = socket_id; // sobrescreve socket_id existente

        await connectionsService.create(connection);
      }
    }

    await messagesService.create({
      text,
      user_id,
    });

    const allMessages = await messagesService.listByUser(user_id);

    socket.emit("client_list_all_messages", allMessages);

    const allUsers = await connectionsService.findAllWithoutAdmin();
    io.emit("admin_list_all_users", allUsers);
  });

  socket.on("client_send_to_admin", async (params) => {
    const { text, socket_admin_id } = params;

    const socket_id = socket.id;

    const { user_id } = await connectionsService.findBySocketID(socket_id);

    // Precisamos salvar essa mensagem no DB e enviar para o administrador
    const message = await messagesService.create({
      text,
      user_id,
    });

    io.to(socket_admin_id).emit("admin_receive_message", {
      message,
      socket_id,
    });
  });
});
