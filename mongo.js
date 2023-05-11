const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Add a password as an argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://imkusa:${password}@cluster0.aookaoo.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(result => {
    console.log('note saved')
    mongoose.connection.close()
  })
} else if (process.argv.length === 3) {
  console.log('Phonebook:')
  Person.find({}).then(result => {
    result.forEach(note => {
      console.log(note.name, note.number)
    })
    mongoose.connection.close()
  })
}


