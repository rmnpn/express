import express, { Request, Response } from "express";

import { IUser, read, write } from "./fs.service";
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(PORT, () => {
  console.log("SERVER EBASHE");
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const data = await read();
    res.status(200).send(data);
  } catch (e) {
    res.status(400).json(e.message);
  }
});

app.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      throw new Error("Hueve ID");
    }
    const users = await read();
    const index = users.findIndex((user: IUser) => user.id === id);
    if (index === -1) {
      //*якщо немає співпадінь, тоді в методі findIndex -1
      throw new Error("user sibavsi");
    }
    res.json({ data: users[index] });
  } catch (e) {
    console.log(e.message);
    res.status(400).json(e.message);
  }
});

app.post("/users", async (req: Request, res: Response) => {
  try {
    const { name, email, age } = req.body; //* замість user дестр. для перевікри на валідність
    if (!age || !Number.isInteger(age) || age < 0 || age > 100) {
      throw new Error("oi, ne pyzdy");
    }
    if (!email || !email.includes("@")) {
      throw new Error("oi, ne nayobui");
    }
    if (!name || name.length < 3) {
      throw new Error("oi, sibes");
    }
    const users = await read();
    users.push({ id: users[users.length - 1].id + 1, email, name, age });
    await write(users);
    res.json({ message: "New user created" });
  } catch (e) {
    res.status(400).json(e.message);
  }
});

app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!Number.isInteger(+id)) {
      throw new Error("Hueve ID");
    }
    const users = await read();
    const index = users.findIndex((user) => user.id === +id);
    if (index === -1) {
      //*якщо немає співпадінь, тоді в методі findIndex -1
      throw new Error("user sibavsi");
    }
    users.splice(index, 1);
    await write(users);
    res.status(200).send({ message: "user has been deleted" });
  } catch (e) {
    res.status(400).json(e.message);
  }
});

app.put("/users/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!Number.isInteger(id)) {
      throw new Error("Hueve ID");
    }

    const users = await read();
    const index = users.findIndex((user: IUser) => user.id === +id);
    if (index === -1) {
      //*якщо немає співпадінь, тоді в методі findIndex -1
      throw new Error("user sibavsi");
    }
    users[index] = req.body; //const updateUserParams = req.body;
    // users[+id]=updateUserParams;
    res.status(200).send({ message: "user updated successfully" });
  } catch (e) {
    res.status(400).json(e.message);
  }
});
