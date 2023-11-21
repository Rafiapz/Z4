
async function bestSellingProducts(req,res){

    try {
        
    } catch (error) {
        console.log(error);
        res.render('usersfold/error',{user:true})
    }
}

module.exports={bestSellingProducts}