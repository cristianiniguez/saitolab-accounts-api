import { Role } from 'src/auth/models/role.model';

export class CreateUserDTO {
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly role: Role;
}
