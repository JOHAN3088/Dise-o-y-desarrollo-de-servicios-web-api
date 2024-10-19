const ModelUser=require("./model")
const express=require ("express");
const dbconect=require("./config")
const app= express();
const router = express.Router();
//manejador de la contraseña
const bcrypt= require('bcrypt')  
//sign up
router.post('/',async(req,res)=>{
    let {nombre,correo,password}= req.body;
    nombre=nombre.trim();
    correo=correo.trim();
    password=password.trim();
   

    if(nombre=="" || correo=="" || password==""){
        res.json({
            status:"FALLIDO",
            message:"Campos vacios invalidos"
        });
    }else if(!/^[a-zA-Z]*$/.test(nombre)){
        res.json({
            status:"FALLIDO",
            message:"input nombre invalido"
        });       
   
    }else if(password.length < 6){        
        res.json({
            status:"FALLIDO",
            message:"input contraseña invalido, el numero minimo de caracteres requerido es de 6"
        })    
    }else{
        ModelUser.find({correo}).then(result => {
            if(result.length){
                //si ya se  ecuentra el usuario en la base de datos
                res.json({
                    status:"FAILED",
                    message:"el usuario suministrado ya existe en la base de datos"
                });
            }else{
                //tratar de crear un nuevo usuario

                //manejador de la contraseña
                let checkRouds= 10;
                bcrypt.hash(password,checkRouds).then(hashhadPassword=>{
                    const newUser= new ModelUser({
                        nombre,
                        correo,
                        password : hashhadPassword
                    });
                    newUser.save().then(resultado =>{
                        res.json({
                            status:"SUCCES",
                            message:"El usuario se ha creado correctamente",
                            data:resultado,
                        })
                    }).catch(err=>{
                        res.json({
                            status: "FAILED",
                            message:"Un errro a ocurrido al momento de guardar la informacin del usuario"
                        })
                    })

                }).catch(err=>{
                    res.json({
                        status:"FAILED",
                        message:"Un error ocurrio con la contraseña "
                    })    
                })
            }
        }).catch(err =>{
            console.log(err)
            res.json({
                status:"FAILED",
                message:"Un error ocurrio mientras se estaba buscando al usuario"
            });
        })
    }
})

//sign in
router.post('/login',async(req,res)=>{
    let {correo,password}= req.body;
    correo=correo.trim();
    password = password.trim();

    if(correo=="" || password==""){
        res.json({
            status:"FAILDE",
            message:"credenciales vacias suministradas"
        })
        }else{
            ModelUser.find({correo})
            .then(data=>{
                if(data.length){
                    const hashhadPassword= data[0].password;
                    bcrypt.compare(password,hashhadPassword).then(result =>{
                    if(result){
                        res.json({
                            status:"SUCCES",
                            message:"Inicio de sesion exitoso",
                            data : data
                             })
                    }else{
                        res.json({
                            status:"FAILED",
                            message:"la contraseña es incorrecta"
                        })
                    }
                 })
                 .catch(err=>{
                    res.json({
                        status:"FAILED",
                        message:"un error ocurrio al momento de comparar contraseñas"
                    })
                
                })
                 
                }else{
                    res.json({
                        status:"FAILED",
                        message:"credenciales invalidas!"
                    })
              }           
        })
        .catch(err =>{
            res.json({
                status:"FAILED",
                message:"Un error ocurrio mientras se checaba la existencia del usuario"
            })
        });
    }   
 })
  app.use(express.json());
  app.use(router);    
  app.listen(3005,()=>{
    console.log("el servidor esta en el puerto 3005")
});  
dbconect();




