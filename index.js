require('dotenv').config()

const express = require('express') //otetaan käyttöön express (web-framework Node.js:lle, joka helpottaa palvelinpuolen kehitystä)
const Note = require('./models/note')
const app = express()


const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json( {error: error.message} )
  }

  next(error)
}



//const cors = require('cors')
//app.use(cors())

app.use(express.static('dist'))

app.use(express.json())

app.use(requestLogger)

//    "build:ui": "rm -rf dist && cd C:/Users/laura/OneDrive - Laura-Kaisa Leinonen/Koulu/FullStackOpen/Harjoittelua/Osa2/harjoittelua2 && npm run build && cp -r dist C:/Users/laura/OneDrive - Laura-Kaisa Leinonen/Koulu/FullStackOpen/Harjoittelua/Osa3/Harjoittelua",
//     "build:ui": "@powershell Remove-Item -Recurse -Force dist && cd \"C:/Users/laura/OneDrive - Laura-Kaisa Leinonen/Koulu/FullStackOpen/Harjoittelua/Osa2/harjoittelua2\" && npm run build && @powershell Copy-Item dist -Recurse \"C:/Users/laura/OneDrive - Laura-Kaisa Leinonen/Koulu/FullStackOpen/Harjoittelua/Osa3/Harjoittelua\"",
//     "build:ui": "@powershell Remove-Item -Recurse -Force dist && cd C:/Users/laura/OneDrive - Laura-Kaisa Leinonen/Koulu/FullStackOpen/Harjoittelua/Osa2/harjoittelua2 && npm run build && @powershell Copy-Item dist -Recurse C:/Users/laura/OneDrive - Laura-Kaisa Leinonen/Koulu/FullStackOpen/Harjoittelua/Osa3/Harjoittelua",









// Jotta saamme Expressin näyttämään staattista sisältöä eli sivun index.html ja sen lataaman JavaScriptin ym. tarvitsemme Expressiin sisäänrakennettua middlewarea static.
// tarkastaa Express GET-tyyppisten HTTP-pyyntöjen yhteydessä ensin löytyykö pyynnön polkua vastaavan nimistä tiedostoa hakemistosta dist. Jos löytyy, palauttaa Express tiedoston.





//Routet

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
// Express muuntaa palautettavan datan automaattisesti JSON-muotoon. Ei siis ole JavaScript-olio vaan JSON-merkkijono.
/*
const generateId = () => {
  const maxID = notes.length > 0
    ? Math.max(...notes.map(n=> Number(n.id)))
    : 0
  return String(maxID + 1)

}
*/

app.post('/api/notes', (request, response, next) => {
  const body = request.body

  /*
  if (!body.content) { //content ei saa olla tyhjä
    return response.status(400).json({
      error: 'content missing'
    })
  }
  */

  const note = new Note ({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
  //notes = notes.concat(note)
  //console.log(note)
  //response.json(note)
})

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
    })
/*
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  if (note) {
      response.json(note)
  } else {
      response.status(404).end()
  }
*/



app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
//  const id = request.params.id
//  notes = notes.filter(note => note.id !== id)

// response.status(204).end()
})

app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body

  Note.findById(request.params.id)
    .then(note => {
      if (!note) {
        return response.status(404).end()
      }

      note.content = content
      note.important = important

      return note.save().then((updatedNote) => {
        response.json(updatedNote)
      })
    })
    .catch(error => next(error))
})




const unknownEndpoint = (request, response) => {
  response.status(404).send( {error: 'unknown endpoint'} )
}

app.use(unknownEndpoint)




app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

/*
const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
*/


/*
const app = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(notes))
})



const app = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end('Hello World')
})
*/