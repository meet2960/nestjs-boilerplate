import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport';

@Injectable()
export class PublicStrategy extends PassportStrategy(Strategy, 'public') {
  validate(..._args: any[]): unknown {
    throw new Error('Method not implemented.');
  }
  constructor() {
    super();
  }

  authenticate(): void {
    return this.success({ [Symbol.for('isPublic')]: true });
  }
}
