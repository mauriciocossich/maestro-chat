// criar evento quando admin acessar essa página e ver a lista
// criar evento para quando cliente novo se conectar e o admin estar ouvindo

import { io } from "../http";
import { ConnectionsService } from "../services/ConnectionsService";
import { MessagesService } from "../services/MessagesService";

io.on("connect", async (socket) => {
  const connectionsService = new ConnectionsService();
  const messagesService = new MessagesService();

  const allConnectionsWithoutAdmin =
    await connectionsService.findAllWithoutAdmin();

  // vamos emitir o evento sem socket, porque o socket manda direto para os clientes
  io.emit("admin_list_all_users", allConnectionsWithoutAdmin);

  // Trazer mensagens do usuário para o admin
  socket.on("admin_list_messages_by_user", async (params, callback) => {
    const { user_id } = params;

    const allMessages = await messagesService.listByUser(user_id);

    callback(allMessages);
  });

  socket.on("admin_send_message", async (params) => {
    const { user_id, text } = params;

    await messagesService.create({
      text,
      user_id,
      admin_id: socket.id, // valor do socket para facilitar a comunicação
    });

    const { socket_id } = await connectionsService.findByUserId(user_id);

    io.to(socket_id).emit("admin_send_to_client", {
      text,
      socket_id: socket.id,
    });
  });

  socket.on("admin_user_in_support", async (params) => {
    const { user_id } = params;
    await connectionsService.updateAdminID(user_id, socket.id);

    const allConnectionsWithoutAdmin =
      await connectionsService.findAllWithoutAdmin();

    io.emit("admin_list_all_users", allConnectionsWithoutAdmin);
  });
});
