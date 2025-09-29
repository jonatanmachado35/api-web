import { Injectable } from '@nestjs/common';
import { User, SafeUser } from './user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [];
  private nextId = 1;

  async create(email: string, passwordHash: string, name: string): Promise<SafeUser> {
    const newUser: User = {
      id: this.nextId++,
      email,
      passwordHash,
      name,
      createdAt: new Date(),
    };

    this.users.push(newUser);
    return this.toSafeUser(newUser);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }

  async findById(id: number): Promise<SafeUser | undefined> {
    const user = this.users.find((item) => item.id === id);
    return user ? this.toSafeUser(user) : undefined;
  }

  private toSafeUser(user: User): SafeUser {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
