import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT;

const db = new pg.Client({
    connectionString:process.env.DATABASE_URL
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Enjoy Yourself!" },
  { id: 2, title: "It's later than you think" },
];

app.get("/", async (req, res) => {
  //console.log(items);
  try{
    const itemDB = await db.query("SELECT * FROM items");
    let items = itemDB.rows;

    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
}
  catch(err){
    console.error(err);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try{
    await db.query("INSERT INTO items (title) VALUES ($1)",[item]);
    res.redirect("/");
  } catch(err){
    console.error(err);
  }
});

app.post("/edit", async (req, res) => {
  const updatedItemTitle = req.body.updatedItemTitle;
  const updatedItemId = req.body.updatedItemId;
  try{
    await db.query("UPDATE items SET title = $1 WHERE id = $2",[updatedItemTitle, updatedItemId]);
    res.redirect("/");
  }
  catch(err){
    console.error(err);
  }
});

app.post("/delete", async(req, res) => {
  let itemId = req.body.deleteItemId;
  try{
    await db.query("DELETE FROM items WHERE id = $1",[itemId]);
    res.redirect("/");
  }
  catch(err){
    console.error(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
