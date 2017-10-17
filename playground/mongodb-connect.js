const MongoClient =  require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp',(error,db)=>{
    if(error)
    {
        return console.log("Unable to connect to the MongoDB Server");
    }
    console.log("Connected to the Database");

    db.collection('todos').insertOne({
        task:"to play games",
        completed:false     
    },(error, result)=>{
        if(error)
        {
            return console.log(error);
        }
        console.log(JSON.stringify(result.ops,undefined,2));
    });
    db.collection('todos').find().toArray().then((result)=>{
        console.log(result);
    })
    .catch((error)=>{
        console.log(error);
    })
    // db.close();
});