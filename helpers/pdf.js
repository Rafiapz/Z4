const fs = require("fs");
const pdf = require("html-pdf");
const handlebars = require("handlebars");
const ordersCol = require("../model/orderModel");

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

      const formattedDate = mongoDBDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      ob.Order_Date = formattedDate;

      total = total + ob.Total_Amount;
    });

    const data = {
      salesSummary: salesSummary,
      total: total,
    };

    const renderedHtml = template(data);

    const options = {
      format: "A5",
      orientation: "portrait",
    };

    const location =
      "./public/admin/pdf/salesReport" +
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      ".pdf";
    pdf.create(renderedHtml, options).toFile(location, (err, response) => {
      if (err) return console.log(err);

      res.download(location);
      // fs.unlink(location, (err) => {
      //     if (err) {
      //         console.error(`Error deleting file: ${err}`);
      //     }
      // });
    });
  } catch (error) {
    console.log(error);
    res.render("adminfold/error");
  }
}

module.exports = { download, dateWiseReports };
