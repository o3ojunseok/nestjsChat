import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';


@WebSocketGateway(81, { namespace: 'chat' })
export class ChatGateway {
  @WebSocketServer()
  server;

  wsClients = [];

  @SubscribeMessage('안녕하세요')
  connectSomeone(@MessageBody() data: string, @ConnectedSocket() client) {
    const [username, room] = data;
    console.log(`${username}님이 ${room}에 접속했습니다.`);
    const comeOn = `${username}님이 입장했습니다.`;
    this.server.emit('comeOn' + room, comeOn);
    this.wsClients.push(client);
  }

  private broadcast(event, client, message: any) {
    for (const c of this.wsClients) {
      if (client.id == c.id)
        continue;
      c.emit(event, message);
    }
  }

  @SubscribeMessage('send')
  sendMessage(@MessageBody() data: string, @ConnectedSocket() client) {
    const [room, username, message] = data;
    console.log(`${client.id} : ${data}`);
    this.broadcast(room, client, [username, message]);
  }
}
