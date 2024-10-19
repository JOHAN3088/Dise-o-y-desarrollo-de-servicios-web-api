const mongoose=require("mongoose");

const dbconect=()=>{
    mongoose.set('strictQuery',true);
    mongoose.connect('mongodb://127.0.0.1:27017/ejemplo').then((succes)=> console.log("conexion exitosa"))
    .catch((err)=> console.log(err.message));  
  }

  module.exports = dbconect;
  