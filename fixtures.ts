import mongoose from "mongoose";
import config from "./config";
import User from "./models/User";
import Task from "./models/Task";

const dropCollection = async (
  db: mongoose.Connection,
  collectionName: string
) => {
  try {
    await db.dropCollection(collectionName);
  } catch (e) {
    console.log(`Collection ${collectionName} was missing, skipping drop...`);
  }
};

const run = async () => {
  await mongoose.connect(config.mongoose.db);
  const db = mongoose.connection;

  const collections = ["users", "tasks"];

  for (const collectionName of collections) {
    await dropCollection(db, collectionName);
  }

  const [Sergey, Oleg] = await User.create(
    {
      username: "Sergey",
      password: "123321",
      token: crypto.randomUUID(),
    },
    {
      username: "Oleg",
      password: "321123",
      token: crypto.randomUUID(),
    }
  );

  await Task.create(
    {
      user: Sergey,
      title: "Clean dishes",
      description: "Clean dishes with soap",
      status: "new",
    },
    {
      user: Oleg,
      title: "Do work",
      description: "Do some house work",
      status: "new",
    }
  );

  await db.close();
};

void run();
