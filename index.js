const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express ()

morgan.token('object', function getObject(req) {
  if(req.method === 'POST') {
    return JSON.stringify(req.body)
  } else {
    return null
  }})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object'))
app.use(express.static('build'))
app.use(cors())


let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  response.send(persons)
})

app.get('/info', (request, response) => {
  const date = Date()
  response.send(`Phonebook has info for ${persons.length} people<br><br>
    ${date}`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  response.json(person)
  console.log(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log(persons)
  persons = persons.filter(person => person.id !== id)
  console.log(persons)
  response.status(204).end()
  
})

const getRandomInt = (max) => {
  max = Math.floor(max)
  return Math.floor(Math.random() * (max + 1) )
}

const generateId = () => {
  const id = persons.length > 0
    ? getRandomInt(5000)
    : 0
  return id
}

app.post('/api/persons', (request, response) => {
  if (!request.body || !request.body.name || !request.body.number) {
     console.log(`request content is empty`)
     return response.status(400).json({
      error: `Attempt to add an object that doesn't exit or doesn't have a name
      or proper number`
    })
  }

  const body = request.body
  if (persons.filter( person => person.name === body.name  )) {
    console.log(`${body.name} already in phonebook`)
    return response.status(400).json({
      error: `${body.name} already in phonebook`
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  console.log("added", person)
  persons = persons.concat(person)
  response.json(person)
  
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
