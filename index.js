const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express ()

// load .env environment variables
require('dotenv').config()

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

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)


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
  Person.find({}).then(persons =>{
    console.log(persons)
    response.json(persons)
  }
    )
})

app.get('/info', (request, response) => {
  const date = Date()
  response.send(`Phonebook has info for ${persons.length} people<br><br>
    ${date}`)
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

const unknownIDHandler = (error, request, reponse, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(unknownIDHandler)

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
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
  const body = request.body
  console.log("inside app.post", body)

  if (body === undefined) {
    return response.status(400).json({error: 'content missing'})
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(person => {
    response.json(person)
  })
  
})

const PORT = process.env.PORT || "8080"
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
