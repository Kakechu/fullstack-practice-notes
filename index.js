const express = require('express') //otetaan käyttöön express (web-framework Node.js:lle, joka helpottaa palvelinpuolen kehitystä)
const app = express()

//otetaan käyttöön express, joka on tällä kertaa funktio, jota kutsumalla luodaan muuttujaan app sijoitettava Express-sovellusta vastaava olio

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

const cors = require('cors')

//    "build:ui": "rm -rf dist && cd C:/Users/laura/OneDrive - Laura-Kaisa Leinonen/Koulu/FullStackOpen/Harjoittelua/Osa2/harjoittelua2 && npm run build && cp -r dist C:/Users/laura/OneDrive - Laura-Kaisa Leinonen/Koulu/FullStackOpen/Harjoittelua/Osa3/Harjoittelua",
//     "build:ui": "@powershell Remove-Item -Recurse -Force dist && cd \"C:/Users/laura/OneDrive - Laura-Kaisa Leinonen/Koulu/FullStackOpen/Harjoittelua/Osa2/harjoittelua2\" && npm run build && @powershell Copy-Item dist -Recurse \"C:/Users/laura/OneDrive - Laura-Kaisa Leinonen/Koulu/FullStackOpen/Harjoittelua/Osa3/Harjoittelua\"",
//     "build:ui": "@powershell Remove-Item -Recurse -Force dist && cd C:/Users/laura/OneDrive - Laura-Kaisa Leinonen/Koulu/FullStackOpen/Harjoittelua/Osa2/harjoittelua2 && npm run build && @powershell Copy-Item dist -Recurse C:/Users/laura/OneDrive - Laura-Kaisa Leinonen/Koulu/FullStackOpen/Harjoittelua/Osa3/Harjoittelua",

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}


app.use(express.json())
app.use(requestLogger)

app.use(cors())
//app.use(express.static('dist'))

const unknownEndpoint = (request, response) => {
  response.status(404).send( {error: 'unknown endpoint'} )
}

//Routet

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})
// Express muuntaa palautettavan datan automaattisesti JSON-muotoon. Ei siis ole JavaScript-olio vaan JSON-merkkijono.

const generateId = () => {
  const maxID = notes.length > 0
    ? Math.max(...notes.map(n=> Number(n.id)))
    : 0
  return String(maxID + 1)
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) { //content ei saa olla tyhjä
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  }

  notes = notes.concat(note)
  //console.log(note)
  response.json(note)
})

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  if (note) {
      response.json(note)
  } else {
      response.status(404).end()
  }
})


app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
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