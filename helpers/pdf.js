const fs = require("fs");
const pdf = require("html-pdf");
const handlebars = require("handlebars");
const ordersCol = require("../model/orderModel");
const puppeteer = require('puppeteer');


async function dateWiseReports(req, res) {
  try {
    req.session.startDate = req.body.Start;
    req.session.endDate = req.body.End;

    let startDate = req.session.startDate;
    let endDate = req.session.endDate;

    let query = { Status: "Delivered" };

    if (startDate && endDate) {
      let prevDay = new Date(startDate);
      prevDay.setDate(prevDay.getDate() - 1);

      startDate = prevDay;

      query.Order_Date = { $gte: startDate, $lte: endDate };
    }
    if (startDate == endDate) {
      let prevDay = new Date(startDate);
      prevDay.setDate(prevDay.getDate() - 1);

      prevDay = prevDay.toISOString();

      query.Order_Date = { $gte: prevDay, $lte: startDate };
    }

    const salesSummary = await ordersCol
      .find(query)
      .populate("User_id")
      .limit(10)
      .lean();

    let total = 0;
    salesSummary.forEach((ob) => {
      const mongoDBDate = ob.Order_Date;

      const formattedDate = mongoDBDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      ob.Order_Date = formattedDate;

      total = total + ob.Total_Amount;
    });

    res.render("adminfold/salesReport", {
      admin: true,
      salesSummary,
      date: true,
      total,
    });

    return salesSummary;
  } catch (error) {
    console.log(error);
    res.render("adminfold/error");
  }
}

async function brandWiseSalesSummary(req,res){

  try {

    

    
  } catch (error) {
    console.log(error);
    res.render('adminfold/error',{admin:true})
  }
}



async function download(req, res) {
  try {
    let startDate = req.session.startDate;
    let endDate = req.session.endDate;

    const templateHtml = fs.readFileSync(
      "./views/adminfold/salesReport.handlebars",
      "utf8"
    );

    const template = handlebars.compile(templateHtml);

    let query = { Status: "Delivered" };

    if (startDate && endDate) {
      let prevDay = new Date(startDate);
      prevDay.setDate(prevDay.getDate() - 1);

      startDate = prevDay;
      query.Order_Date = { $gte: startDate, $lte: endDate };
    }

    if (startDate == endDate && startDate != undefined) {
      let prevDay = new Date(startDate);
      prevDay.setDate(prevDay.getDate() - 1);

      prevDay = prevDay.toISOString();

      query.Order_Date = { $gte: prevDay, $lte: startDate };
    }

    const salesSummary = await ordersCol
      .find(query)
      .populate("User_id")
      .limit(10)
      .lean();

    let total = 0;

    salesSummary.forEach((ob) => {
      const mongoDBDate = ob.Order_Date;

      const formattedDate = new Date(mongoDBDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      ob.Order_Date = formattedDate;

      total = total + ob.Total_Amount;
    });

    const htmlString = template({ salesSummary, total });
   

    const pdfPath =
      "./public/admin/pdf/salesReport" +
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      ".pdf";

    const document = {
      html: htmlString,
      path: pdfPath,
    };

    const options = {
      format: 'A5',
      orientation: 'portrait',
    };

    pdf.create(htmlString, options).toFile(pdfPath, (err) => {
      if (err) {
        console.log('Error generating PDF:', err);
        res.render('adminfold/error', { admin: true });
      } else {
        // Send the generated PDF as a download
        res.download(pdfPath, 'salesReport.pdf', (downloadErr) => {
          if (downloadErr) {
            console.error('Error downloading PDF:', downloadErr);
            res.status(500).send('Error downloading PDF');
          }


          fs.unlinkSync(pdfPath);
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.render('adminfold/error', { admin: true });
  }
}

module.exports = { download, dateWiseReports, brandWiseSalesSummary };



// const salesSummary = await ordersCol
// .find(query)
// .populate("User_id")
// .limit(10)
// .lean();

// let total = 0;

// salesSummary.forEach((ob) => {
// const mongoDBDate = ob.Order_Date;

// const formattedDate = new Date(mongoDBDate).toLocaleDateString("en-US", {
//   year: "numeric",
//   month: "long",
//   day: "numeric",
// });

// ob.Order_Date = formattedDate;

// total = total + ob.Total_Amount;
// });

// const htmlString = template({ salesSummary, total });
// console.log('Generated HTML:', htmlString);

//   const browser = await puppeteer.launch({
// executablePath: '/usr/bin/chromium-browser',
// headless: true,
// args: ['--no-sandbox'],


// })
// const page = await browser.newPage();
// await page.setContent(htmlString);

// const pdfPath =
// "./public/admin/pdf/salesReport" +
// Date.now() +
// "-" +
// Math.round(Math.random() * 1e9) +
// ".pdf";

// await page.pdf({
// path: pdfPath,
// format: 'A3',
// printBackground: true,
// });

// await browser.close();

// // Send the generated PDF as a download
// res.download(pdfPath, 'salesReport.pdf', (downloadErr) => {
// if (downloadErr) {
//   console.error('Error downloading PDF:', downloadErr);
//   res.status(500).send('Error downloading PDF');
// }

// // Delete the generated PDF file after download
// fs.unlinkSync(pdfPath);
// });
// } catch (error) {
// console.log(error);
// res.render('adminfold/error', { admin: true });
// }
// }
