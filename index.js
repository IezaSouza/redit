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
  res.status(200).json(dbNAme);
  console.log("Inserted documents =>", insertResult);
});

/*
// implement endpoint to create a post (in a subredit)
app.post("/community/:communityName/posts", (req, res) => {
  const { communityName } = req.params;
  const { title, content } = req.body;
  if (title && content) {
    if (community[communityName]) {
      const postId = Object.keys(posts).length + 1;
      const post = { id: postId, title, content };
      posts[postId] = post;
      community[communityName].posts.push(post);
      res.status(201).json({ message: "Post created sucessfully" });
    } else {
      res.status(404).json({ error: "Community not found" });
    }
  }
});

// implement endpoint to list a subredit's posts

app.get("/community/:communityName/posts", (req, res) => {
  const { communityName } = req.params;

  if (community[communityName]) {
    const communityPosts = community[communityName].posts;
    res.status(200).json(communityPosts);
  } else {
    res.status(404).json({ error: "Community not found" });
  }
});

// implement endpoint to get the comments for a post

app.get("/community/:communityName/posts/:postId/comments", (req, res) => {
  const { communityName, postId } = req.params;

  if (community[communityName]) {
    const communityPosts = community[communityName].posts;
    const post = communityPosts.find((post) => post.id === parseInt(postId));

    if (post) {
      const comments = post.comments || [];
      res.status(200).json(comments);
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  }
});

// implement endpoint to edit a post

app.put("/community/:communityName/posts/:postId", (req, res) => {
  const { communityName, postId } = req.params;
  const { title, content } = req.body;

  if (community[communityName]) {
    const communityPosts = community[communityName].posts;
    const postIndex = communityPosts.findIndex(
      (post) => post.id === parseInt(postId)
    );

    if (postIndex !== -1) {
      communityPosts[postIndex].title = title;
      communityPosts[postIndex].content = content;
      res.status(200).json({ message: "Post updated sucessfully" });
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  }
});

*/

async function start(app) {
  await client.connect();
  console.log("Connected successfully to server");
  db = client.db(dbNAme);

  app.listen(process.env.PORT, () => {
    console.log("server is running (express)");
  });

  /* implement endpoint to create a subredit/community
  const insertResult = await collection.insertMany([
    { a: "Back-End Forum" },
    { a: "React Forum" },
    { a: "JS Forum" },
  ]);
  console.log("Inserted documents =>", insertResult);
*/
}

start(app)
  .then(() => console.log("start routine complete"))
  .catch((err) => console.log("star routine error: ", err));
