import fs from "fs/promises";
import * as path from "path";

import { IUser } from "./types/user.type";

const usersPathToFile = path.join(process.cwd(), "db.json");
const read = async (): Promise<IUser[]> => {
  const json = await fs.readFile(usersPathToFile, "utf-8");
  return JSON.parse(json);
};

const write = async (users: IUser[]): Promise<void> => {
  await fs.writeFile(usersPathToFile, JSON.stringify(users));
};

export { read, write };
