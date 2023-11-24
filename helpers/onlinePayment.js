const Razorpay=require('razorpay')



let instance = new Razorpay({
    key_id: 'rzp_test_n7T0wcONYZwk3H',
    key_secret: process.env.razorpaySecretKey,
  });
  
  
  async function generateRazorPay(orderId,total){
  
    try {
  

  
       let options = {
        amount: total*100,  // amount in the smallest currency unit
        currency: "INR",
        receipt: orderId
      };
      instance.orders.create(options,(err, order)=> {
    
  
        if(err){
          console.log(err);
        }
  
        return order
      });
  
      
      
    } catch (error) {
      console.log(error);
      res.render('usersfold/error')
    }
  }


async function verifyOnlinePayment(req,res){

  try {

   
    
  } catch (error) {
    console.log(error);
    res.render('usersfold/error',{user:true})
  }
}


  module.exports={generateRazorPay,verifyOnlinePayment}
  