const Person = require('./models/person')
const mongoose = require('mongoose')

const password = process.argv[2]

const url = `mongodb+srv://chase:${password}@cluster0.9bzkg6w.mongodb.net/personApp?retryWrites=true&w=majority`

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}
else if (process.argv.length === 3){
    mongoose
        .connect(url)
        .then(
            Person.find({}).then(result => {
                console.log('phonebook:')
                result.forEach(person =>{
                    console.log(person.name, ' ', person.number)
                })
                mongoose.connection.close()
            })
        )
}

else if(process.argv.length === 5){
    mongoose
    .connect(url)
    .then((result) => {
        console.log('connected')

        const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
        })
        return person.save()
    })
    .then(() => {
        console.log('added ', process.argv[3], ' number ', process.argv[4], ' to phonebook')
        return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
    }
else{
    console.log('Please review your parameters')
    process.exit(1)
}


