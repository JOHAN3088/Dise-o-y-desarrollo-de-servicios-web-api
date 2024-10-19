const mongoose=require("mongoose");
const userModel= new mongoose.Schema(
    {
    nombre:{
        type: String
    },
    correo:{
        type: String            
    },
    password:{
        type: String
    }
},
    {
        timestamps: true,
        versionKey:false,
   }
);
const ModelUser = mongoose.model('dbs',userModel);
module.exports = ModelUser;
