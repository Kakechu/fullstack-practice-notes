const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://laurakaisaleinonen:${password}@cluster0.yso66.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

// parametrina oleva 'Note' määrittelee, että Mongoose tallettaa muistiinpanoa vastaavat oliot kokoelmaan 'notes' (konventio: kokoelmien nimet monikossa 'notes', viitataan skeeman määrittelyssä yksikkömuodossa 'Note') 



Note.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })

/*
const note = new Note({
  content: 'HTML is easy',
  important: true,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
*/