const express = require('express')
const fs = require("fs")
let app = express()

let movies = JSON.parse(fs.readFileSync('./express/movies.json'))


app.get('/api/v1/movies', (req, res) => {
    res.status(200).json({
        "status": "success",
        "data": {
            movies: movies
        }
    })

})

app.listen(8080, () => {
    console.log("Server in running");
})