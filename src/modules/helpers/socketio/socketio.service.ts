import { Injectable } from '@nestjs/common';
import { CreateSocketioDto } from './dto/create-socketio.dto';
import { UpdateSocketioDto } from './dto/update-socketio.dto';
import { Socket } from 'socket.io';

@Injectable()
export class SocketioService {
  private readonly connectedClients: Map<string, Socket> = new Map();
  handleConnection(socket: Socket): void {
    const clientId = socket.id;
    console.log(
      '---------------------------------------------------------------------------------------',
    );
    console.log('Client connected:', clientId);
    this.connectedClients.set(clientId, socket);
  }

  handleDisconnect(socket: Socket): void {
    const clientId = socket.id;
    console.log('Client disconnected:', clientId);
    this.connectedClients.delete(clientId);
    console.log(
      '---------------------------------------------------------------------------------------',
    );
  }

  // * Auto Generated Methods
  create(_createSocketioDto: CreateSocketioDto) {
    return 'This action adds a new socketio';
  }

  findAll() {
    return `This action returns all socketio`;
  }

  findOne(id: number) {
    return `This action returns a #${id} socketio`;
  }

  update(id: number, _updateSocketioDto: UpdateSocketioDto) {
    return `This action updates a #${id} socketio`;
  }

  remove(id: number) {
    return `This action removes a #${id} socketio`;
  }
}
