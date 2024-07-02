import express, { request, response } from "express";
import { PORT, mongoDBURL} from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookmodel.js";


const app = express();

//middleware to parse request body in json format 

app.use(express.json());

// http method - get resource from server

app.get('/', (request,response)=>{
    console.log(request);
    return response.status(234).send('hello welcome ')
});

//route to save new book
app.post('/books',async (request,response)=>{
    try {
        if(
            !request.body.title ||
            !request.body.author||
            !request.body.publishYear
        ){
            return response.status(400).send({message:'send all required fields'});
        }

        const newBook= {
            title: request.body.title,
            author: request.body.author,
            publishYear: request.body.publishYear,

        };

        const book= await Book.create(newBook);
        return response.status(201).send(book);
        
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message:error.message});
        
    }
});

//route to get all books from database 

app.get('/books', async (request,response)=>{
    try {
        const books= await Book.find({});
        return response.status(200).json({
            count: books.length,
            data: books

        });
        
        
    } catch (error) {
        console.log(error.message);
        respond.status(500).send({message: error.message});
        
    }
});


//route for get one book from database by id

app.get('/books/:id', async (request,response)=>{
    try {
        const {id}=request.params;
        const book= await Book.findById(id);
        return response.status(200).json(book);

        }
        
        
     catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
        
    }
});

//route to update the book

app.put('/books/:id',async (request,response)=>{
    try{
        if(
            !request.body.title ||
            !request.body.author||
            !request.body.publishYear
        ){
            return response.status(400).send({message:'send all required fields'});
        }

        const{id}=request.params;
        const result = await Book.findByIdAndUpdate(id,request.body);

        if(!result){
            return response.status(404).send({message:'book not found'});
        }
        
    return response.status(200).send({message:'book updated succesfuly'})
        
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

//deleting a book from database

app.delete('/books/:id',async(request,response)=>{
    try {

        const {id} = request.params;
        const result=await Book.findByIdAndDelete(id);
        if(!result){
            return response.status(404).send({message:"cannot find book with the id"});

        }
        
        return response.status(200).send({message:"book deleted successfully"});
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
        
    }
})

mongoose
.connect(mongoDBURL)
.then(()=>{
    console.log('App is connected to database');
    //server starts listening on the specified port
    app.listen(PORT, ()=>{
    console.log(`App is listening on port : ${PORT}`);

});


})
.catch((error)=>{
    console.log(error);

})