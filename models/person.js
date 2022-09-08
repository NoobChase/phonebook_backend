const mongoose = require('mongoose')
const password = process.argv[2]

const url = process.env.MONGODB_URL

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

module.exports = mongoose.model('Person', personSchema)