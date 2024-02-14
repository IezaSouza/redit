const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();
require("dotenv").config();

app.use(express.json());

const dbNAme = "edit";
let db;

const client = new MongoClient(process.env.DB_URL);

app.get("/community", (req, res) => {
  res.status(200).json(dbNAme);
});

// implement endpoint to create a subredit/community
app.post("/community", async (req, res) => {
  const insertResult = await db.collection("community").insertMany([req.body]);
  res.status(201).json(dbNAme);
  console.log("Inserted documents =>", insertResult);
});

// implement endpoint to create a post (in a subredit)
app.post("/community/:communityName/posts", async (req, res) => {
  const { communityName } = req.params;
  const { title, content } = req.body;
  if (title && content) {
    try {
      const community = await db
        .collection("community")
        .findOne({ title: communityName });

      if (community) {
        const post = { title, content };

        const insertResult = await db.collection("posts").insertOne(post);

        await db
          .collection("community")
          .updateOne(
            { title: communityName },
            { $push: { posts: insertResult.insertedId } }
          );

        res.status(201).json({ message: "Post created sucessfully " });
      } else {
        res.status(404).json({ error: "Community not found" });
      }
    } catch (error) {
      console.log("Error creating post:", error);
      res.status(500).json({ error: "internal server error" });
    }
  }
});

// implement endpoint to list a subredit's posts

app.get("/community/:communityName/posts", async (req, res) => {
  const { communityName } = req.params;

  try {
    const community = await db
      .collection("community")
      .findOne({ title: communityName });

    if (community) {
      const postIds = community.posts;

      const posts = await db
        .collection("posts")
        .find({ _id: { $in: postIds } })
        .toArray();
      res.status(200).json(posts);
    } else {
      res.status(404).json({ error: "community not found " });
    }
  } catch (error) {
    console.log("error fetching community posts");
    res.status(500).json({ error: "internal server error" });
  }
});

// implement endpoint to edit a post
app.put("/community/:communityName/posts/:postId", async (req, res) => {
  const { communityName, postId } = req.params;
  const { title, content } = req.body;

  try {
    const community = await db
      .collection("community")
      .findOne({ title: communityName });

    // mudar esta parte, não atualiza o post
    if (postId !== -1) {
      await db
        .collection("posts")
        .updateOne({ _id: postId }, { $set: { title, content } });

      res.status(200).json({ message: "post update sucessfully" });
    } else {
      res.status(404).json({ error: "post not found" });
    }
  } catch (error) {
    console.log("Error updating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

async function start(app) {
  await client.connect();
  console.log("Connected successfully to server");
  db = client.db(dbNAme);

  app.listen(process.env.PORT, () => {
    console.log("server is running (express)");
  });
}

start(app)
  .then(() => console.log("start routine complete"))
  .catch((err) => console.log("star routine error: ", err));
