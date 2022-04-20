import { User } from 'src/users/entities/user.entity';

export const removePassword = (user: User) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userToReturn } = user;
  return userToReturn;
};
