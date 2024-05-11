const express = require('express')
const {open} = require('sqlite')
const sqlit3 = require('sqlite3')
const path = require('path')
const dbpath = path.join(__dirname, 'moviesData.db')
const app = express()
app.use(express.json())
let db = null
const convertTODBObj = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlit3.Database,
    })
    app.listen(3000, () => {
      console.log(`server is started`)
    })
  } catch (e) {
    console.log(`eror occures`)
  }
}
convertTODBObj()
const convertMovieDbObjectToResponseObject = dbObject => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  }
}
app.get('/movies/', async (request, response) => {
  const sqlquery = `SELECT * FROM movie;`
  const qyu = await db.all(sqlquery)
  response.send(qyu.map(eachMovie => ({movieName: eachMovie.movie_name})))
})
app.get('/movies/:movieId/', async (request, response) => {
  const movieId = request.params
  const sqlquery = `SELECT * FROM movie WHERE movie_id=${movieId}`
  const qyu = await db.get(sqlquery)
  response.send(convertMovieDbObjectToResponseObject(qyu))
})
app.post('/movies/', async (request, response) => {
  const moviedetails = request.body
  const {directorId, movieName, leadActor} = moviedetails
  const sqlquery = `INSERT INTO movie(director_id,movie_name,lead_actor) VALUES(${directorId},${movieName},${leadActor})`
  await db.run(sqlquery)
  response.send(`Movie Successfully Added`)
})
app.put('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const {directorId, movieName, leadActor} = moviedetails
  const sqlqr = `UPDATE movie SET (director_id=${directorId},movie_name=${movieName},lead_actor=${leadActor}) WHERE movie_id=${movieId}`
  await db.run(sqlqr)
  response.send(`Movie Details Updated`)
})
app.delete('/movies/:movieId', async (request, response) => {
  const {movieId} = request.params
  const deleteq = `DELETE FROM movie WHERE movie_id=${movieId}`
  await db.run(deleteq)
  response.send(`Movie Removed`)
})

module.export = app
