const sharp=require('sharp')
function cropImage(files){

    if(files){

    files.forEach((ob)=>{
     sharp(`./public/uploads/${ob}`)
    .resize({ width: 270, height: 370,fit:'inside',withoutEnlargement:true})
    .toFile(`./public/uploads/cropped/${ob}`, (err, info) => {

        if(err){
            console.log(err);
        }else{
            console.log(info);
            data=info
        }     
    });
    }) 
}     
}

module.exports=cropImage