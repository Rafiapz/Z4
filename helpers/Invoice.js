const easyinvoice = require('easyinvoice');

function generateInvoice(req,res){

    easyinvoice.createInvoice(data, function (result) {
        // The response will contain a base64 encoded PDF file
        console.log('PDF base64 string: ', result.pdf);
    
        // Now this result can be used to save, download or render your invoice
        // Please review the documentation below on how to do this
    });
}


