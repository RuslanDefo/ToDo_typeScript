const DB = require('./db');

class serverController {
  async render(req, res) {
    try {
      const tasks = await DB.query(`SELECT * FROM "tasks" ORDER BY "id"`);
      return res.json(tasks.rows);
    } catch (error) {
      res.json(error)
    }
  }

  async createTask(req, res) {
    try {
      const {text} = req.body;
      const addTask = await DB.query(`INSERT INTO "tasks" ("text", "checked") VALUES ($1, $2) RETURNING *`, [text, false])
      const tasks = await DB.query(`SELECT * FROM "tasks" ORDER BY "id"`);
   // console.log(addTask);
      return  res.json(tasks.rows);
    } catch (error) {
      res.json(error)
    }
  }

  async edit(req, res) {
    try {

      const {text, checked} = req.body;
      const taskId = req.params.id
      const strStatus = JSON.stringify(checked);

      if(text){
        const updateTask = await DB.query(`UPDATE "tasks"
                SET "text" = $1
                WHERE "id" = $2;`, [text, taskId]);

        const tasks = await DB.query(`SELECT * FROM "tasks" ORDER BY "id"`);
        return res.json(tasks.rows);
      }


      if(strStatus){
        const updatedTask = await DB.query(`UPDATE "tasks" SET "checked" = $1 WHERE "id" = $2`, [checked, taskId]);
        const tasks = await DB.query(`SELECT * FROM "tasks" ORDER BY "id"`);
        return res.json(tasks.rows);
      }

    } catch (error) {
      res.json(error)
    }
  }

  async delete(req, res) {
    try {

      const taskId = req.params.id;

      if(taskId !== "0"){
        const deleteTask = await DB.query(`DELETE FROM "tasks" WHERE "id" = $1`, [taskId]);
        const tasks = await DB.query(`SELECT * FROM "tasks" ORDER BY "id"`);
        return res.json(tasks.rows);
      } else {
        const deleteTasks = await DB.query(`DELETE FROM "tasks" WHERE "checked" = $1`, [true]);
        const tasks = await DB.query(`SELECT * FROM "tasks" ORDER BY "id"`);
        return res.json(tasks.rows);
      }
    } catch (error) {
      res.json(error)
    }
  }
}


// @ts-ignore
module.exports = new serverController();
