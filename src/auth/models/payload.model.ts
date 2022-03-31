import { User } from 'src/users/entities/user.entity';

export interface Payload {
  sub: User['id'];
}
