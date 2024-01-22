import { read, write } from "../fs.service";
import { IUser } from "../types/user.type";

class UserRepository {
  public async getAll(): Promise<IUser[]> {
    const data = await read();
    return data;
  }

  public async getByID(id: number): Promise<IUser> {
    const users = await read();
    const index = users.findIndex((user: IUser) => user.id === id);
    if (index === -1) {
      //*якщо немає співпадінь, тоді в методі findIndex -1
      throw new Error("user sibavsi");
    }
    return users[index];
  }

  public async postUser(
    email: string,
    name: string,
    age: number,
  ): Promise<IUser> {
    const users = await read();
    const newUser = { id: users[users.length - 1].id + 1, email, name, age };
    users.push(newUser);
    await write(users);
    return newUser;
  }
  public async deleteById(id: number): Promise<IUser> {
    const users = await read();
    const index = users.findIndex((user) => user.id === +id);
    if (index === -1) {
      //*якщо немає співпадінь, тоді в методі findIndex -1
      throw new Error("user sibavsi");
    }
    const [deletedUser] = users.splice(index, 1);
    await write(users);
    return deletedUser;
  }
  public async editById(id: number, user: IUser) {
    const users = await read();
    const index = users.findIndex((user: IUser) => user.id === +id);
    if (index === -1) {
      //*якщо немає співпадінь, тоді в методі findIndex -1
      throw new Error("user sibavsi");
    }
    users[index] = Object.assign(users[index], user); // в приоритеті user
    await write(users);
    return users[index];
  }
}

export const userRepository = new UserRepository();
