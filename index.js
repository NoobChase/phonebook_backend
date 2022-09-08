require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
var morgan = require('morgan')
const Person = require('./models/person')
app.use(express.json())
app.use(cors())
//app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))
morgan.token('person',function getPerson(req){return JSON.stringify(req.body)})
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
const password = process.argv[2]
const url = `mongodb+srv://chase:${password}@cluster0.9bzkg6w.mongodb.net/?retryWrites=true&w=majority`
const today = new Date()
app.get('/', (request,response)=>{
    response.send('<h1>Hello World!</h1>')
})
app.get('/api/persons',(request,response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})
app.post('/api/persons',(request, response) => {
  const person = request.body
  const isFound = persons.some(element => {
  if(element.name === person.name){
    return true
  }
  return false
})
if (!person.name) {
  return response.status(400).json({ 
    error: 'name missing' 
  })
}
else if (!person.number) {
  return response.status(400).json({ 
    error: 'number missing' 
  })
}
else if (isFound){
  return response.status(400).json({ 
    error: 'name must be unique' 
  })
}
else{
const tempPerson = new Person({
  name:person.name,
  number: person.number
})
  tempPerson.save().then(savedPerson => {
    response.json(savedPerson)
  })
}
    /*const person = request.body
    const isFound = persons.some(element => {
      if(element.name === person.name){
        return true
      }
      return false
    })
    if (!person.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }
    else if (!person.number) {
      return response.status(400).json({ 
        error: 'number missing' 
      })
    }
    else if (isFound){
      return response.status(400).json({ 
        error: 'name must be unique' 
      })
    }
    else{
      person.id = Math.floor(Math.random()*10000)
      persons = persons.concat(person)
      console.log(person)
      response.json(person)
    }*/
})
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id===id)
    if (person){
        response.json(person)
    }
    else{
        response.status(404).end()
    }
})
app.delete('/api/persons/:id',(request,response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})
app.get('/info',(request, response) => {
    response.send('<p>Phonebook has info for '+ (persons.length) +' people</p><p>'+today+'</p>')
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})