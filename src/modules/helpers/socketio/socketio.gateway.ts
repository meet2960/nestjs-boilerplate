import { type OnModuleInit } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import type {
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketioService } from './socketio.service';
import { CreateSocketioDto } from './dto/create-socketio.dto';
import { UpdateSocketioDto } from './dto/update-socketio.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketioGateway
  implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  constructor(private readonly socketioService: SocketioService) {}

  onModuleInit() {
    if (this.server) {
      console.info('Socketio Server is already initialized');
    } else {
      console.info('Socketio Server is not initialized yet');
    }
  }

  handleConnection(socketClient: Socket): void {
    this.socketioService.handleConnection(socketClient);
  }

  handleDisconnect(client: Socket) {
    this.socketioService.handleDisconnect(client);
  }

  sendLog(message?: string) {
    if (this.server) {
      this.server.emit('live-log', message);
    } else {
      console.error('WebSocket server is not initialized.');
    }
  }

  @SubscribeMessage('newMessageFromFE')
  handleNewMessageFromFronted(...args: any) {
    console.info('New Message from Frontend', args);
    console.info('New Message from Frontend', args);

    // client.emit('newMessageFromBE', 'Broadcasting to Current Client only...');
    // if ('client') {
    //   console.log('client', 'client');
    // }
    this.server.emit('newMessageFromBE', 'broadcasting to all....');
  }

  // * Auto Generated Methods
  @SubscribeMessage('createSocketio')
  create(@MessageBody() createSocketioDto: CreateSocketioDto) {
    return this.socketioService.create(createSocketioDto);
  }

  @SubscribeMessage('findAllSocketio')
  findAll() {
    return this.socketioService.findAll();
  }

  @SubscribeMessage('findOneSocketio')
  findOne(@MessageBody() id: number) {
    return this.socketioService.findOne(id);
  }

  @SubscribeMessage('updateSocketio')
  update(@MessageBody() updateSocketioDto: UpdateSocketioDto) {
    return this.socketioService.update(updateSocketioDto.id, updateSocketioDto);
  }

  @SubscribeMessage('removeSocketio')
  remove(@MessageBody() id: number) {
    return this.socketioService.remove(id);
  }
}
