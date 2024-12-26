const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({extended: true}))

mongoose.connect('mongodb://localhost:27017/apiDB')

const apiSchema = new mongoose.Schema({
    title: String,
    content: String
})

const Api = new mongoose.model('Api', apiSchema)


app.route('/articles')

.get((req, res) => {
    Api.find({}, (err, foundArticles) => {
        res.send(foundArticles)
    })
})

.post((req, res) => {
    const api = new Api({
        title: req.body.title,
        content: req.body.content
    })

    api.save((err) => {
        if(!err){
            res.send('Succesfully Added Data')
        }
    })
})

.delete((req, res) => {
    Api.deleteMany((err) => {
        if(!err){
            res.send('Successfully Deleted All The Articles')
        }
    })
})

app.route('/articles/:articlesTitle')
.get((req, res) => {
    Api.findOne({title: req.params.articlesTitle}, (err, foundArticle) => {
        if(!err){
            if(!foundArticle){
                res.send('Not Articles Found')
            } else if(foundArticle){
                res.send(foundArticle)
            }
        }
    })
})

.patch((req, res) => {
    Api.updateOne({title: req.params.articlesTitle}, {title: req.body.title, content: req.body.content}, (err) => {
        if(!err){
            res.send('Successfully Updated the Document')
        }
        else {
            res.send(err)
        }
    })
})

.put((req, res) => {
    Api.updateOne({title: req.params.articlesTitle}, {$set: {title: req.body.title, content: req.body.content}}, {overwrite: true}, (err) => {
        if(!err){
            res.send('Successfully Updated the Document')
        }
        else {
            res.send(err)
        }
    })
})

.delete((req, res) => {
    Api.deleteOne({title: req.params.articlesTitle }, (err) => {
        if(!err){
            res.send('Successfully Deleted The Articles That you Requested')
        }
    })
})


app.listen(3000)