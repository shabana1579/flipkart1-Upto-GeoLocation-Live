let express = require('express');
let app = express();
let port = 9500;
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let mongoUrl = "mongodb+srv://shabana:shabana123@cluster0.6zpxlvz.mongodb.net/?retryWrites=true&w=majority"; //"mongodb://localhost:27017";
let db;

app.get('/', (req,res) => {
    res.send('<h1>Welcome to Flipkart</h1>')
})

// app.get('/category', (req,res) => {
//     db.collection('category').find().toArray((err,result) => {
//         if(err) throw err;
//         res.send(result);
// })
// })

app.get('/category', (req,res) => {
    // let id = Number(req.params.categoryid);
    // console.log(id);
    let category_id = Number(req.query.category_id);
    let table_name;
    if(category_id == 1) {
        table_name = 'electronics'
    } else if(category_id == 2) {
        table_name = 'kitchen_appliances'
    } else if(category_id == 3) {
        table_name='fashion'
    }else if(category_id == 4) {
        table_name='furniture'
    }else if(category_id == 5) {
        table_name='wedding_gifts'
    }else if(category_id ==6 ) {
        table_name='winter_collection'
    } else table_name = 'category'
    
    
    let query = {}
    if(category_id ){
        query ={'category-id':category_id}
    }
    db.collection(table_name).find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result);
})
})

app.get('/filters/:categoryid', (req,res) => {
    // let id = Number(req.params.categoryid);
    // console.log(id);
    let category_id = Number(req.params.categoryid);
    let table_name;
    if(category_id == 1) {
        table_name = 'electronics'
    } else if(category_id == 2) {
        table_name = 'kitchen_appliances'
    } else if(category_id == 3) {
        table_name='fashion'
    }else if(category_id == 4) {
        table_name='furniture'
    }else if(category_id == 5) {
        table_name='wedding_gifts'
    }else if(category_id ==6 ) {
        table_name='winter_collection'
    } else table_name = 'category'
    
    let star = Number(req.query.star);
    let ldiscount = Number(req.query.ldiscount);
    let hdiscount = Number(req.query.hdiscount);
    let brand = req.query.brand;
    let sort;
    let query = {}
    if(brand && star  && ldiscount && hdiscount){
        query ={brand:brand, stars:{$gt:star}, $and:[{discount:{$gt:ldiscount, $lt:hdiscount}}]
        }
        sort = {brand:-1, stars:-1, discount:-1}
    }
        if(brand && star  ){
            query ={brand:brand, stars:{$gt:star}}
            sort = {brand:-1, stars: -1}
            }
            if(star  && ldiscount && hdiscount){
                query ={stars:{$gt:star}, $and:[{discount:{$gt:ldiscount, $lt:hdiscount}}]
                }
            sort = {stars:-1, discount:-1}
            }
                if(brand  && ldiscount && hdiscount){
                    query ={brand:brand, $and:[{discount:{$gt:ldiscount, $lt:hdiscount}}]
                    }
                sort = {brand:-1, discount:-1}
                }
    if(brand) {
        query = {brand:brand}
        sort = {brand:-1}
    }
    else if (star) {
        query = {stars:{$gt:star}}
        sort = {stars:-1}
    }
    else if (ldiscount && hdiscount) {
        query = {$and:[{discount:{$gt:ldiscount, $lt:hdiscount}}]}
            sort = {discount:-1}
    }
    // if(brand && star  && ldiscount && hdiscount){
    //     query ={brand:brand, stars:{$gt:star}, $and:[{discount:{$gt:ldiscount, $lt:hdiscount}}]
    //             }}
    
    if(query){
    db.collection(table_name).find(query).sort(sort).toArray((err,result) => {
        if(err) throw err;
        res.send(result);
    
})
}
})


//connect with mongodb
MongoClient.connect(mongoUrl,{useNewUrlParser:true},(err,dc) => {
    if(err) console.log('Error while connecting');
    db = dc.db('flipkart'); 
    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`);
    })
})