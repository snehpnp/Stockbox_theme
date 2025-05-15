const db = require("../Models");
const multer = require('multer');
const xlsx = require('xlsx');
const csv = require('csv-parser');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
var dateTime = require('node-datetime');
const Stock_Modal = db.Stock;



class Stock {

  async AddStock(req, res) {
    try {
      const { symbol } = req.body;

      if (!symbol) {
        return res.status(400).json({ status: false, message: "symbol is required" });
      }

      const result = new Stock_Modal({
        symbol,

      });

      await result.save();

      return res.json({
        status: true,
        message: "Stock added successfully",
        data: result,
      });

    } catch (error) {
      // Enhanced error logging
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }


  async getStock(req, res) {
    try {

      const { } = req.body;

      const result = await Stock_Modal.find({ del: false });

      return res.json({
        status: true,
        message: "get",
        data: result
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }

  async getStockByService(req, res) {
    try {

      const { segment, symbol } = req.body;

      const result = await Stock_Modal.aggregate([
        {
          $match: {
            segment: segment,
            symbol: { $regex: symbol, $options: 'i' }  // Like query for symbol
          }
        },
        {
          $group: {
            _id: "$symbol",
          }
        }
      ]);

      return res.json({
        status: true,
        message: "get",
        data: result
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }



  
  async getStockByServiceStratrgy(req, res) {
    try {

      const { symbol } = req.body;
      let segment ="F";
      const result = await Stock_Modal.aggregate([
        {
          $match: {
            segment: segment,
            symbol: { $regex: symbol, $options: 'i' }  // Like query for symbol
          }
        },
        {
          $group: {
            _id: "$symbol",
          }
        }
      ]);

      return res.json({
        status: true,
        message: "get",
        data: result
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }

  
  async getStocksByExpiry(req, res) {
    try {
      const { segment, symbol } = req.body;

      // ─── 1) Build expiryMonths (current + next 2) ───
      const currentDate = new Date();
      const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0'); // "01".."12"
      const currentYear = String(currentDate.getFullYear());                   // "2025"

      const expiryMonths = [];
      for (let i = 0; i < 3; i++) {
        // wrap month around after December
        const month = ((parseInt(currentMonth, 10) + i - 1) % 12) + 1;
        const mm = String(month).padStart(2, '0');
        // if we wrapped past December, increment year
        const yyyy = (month < parseInt(currentMonth, 10))
          ? String(parseInt(currentYear, 10) + 1)
          : currentYear;
        expiryMonths.push(`${mm}${yyyy}`); // e.g. "042025"
      }

      // ─── 2) Pull raw grouped expiries ───
      const raw = await Stock_Modal.aggregate([
        {
          $match: {
            symbol: symbol,
            segment: segment,
            expiry_month_year: { $in: expiryMonths }
          }
        },
        {
          $group: {
            _id: "$expiry",
            stock: { $first: "$$ROOT" }
          }
        },
        {
          $project: {
            expiry: "$_id",
            stock: 1,
            _id: 0
          }
        }
      ]);

      // ─── 3) Sort in JS by parsing "DDMMYYYY" to Date ───
      const sorted = raw.sort((a, b) => {
        const parseDDMMYYYY = s => {
          const dd = s.slice(0, 2);
          const mm = s.slice(2, 4);
          const yyyy = s.slice(4);
          return new Date(`${yyyy}-${mm}-${dd}`);
        };
        return parseDDMMYYYY(a.expiry) - parseDDMMYYYY(b.expiry);
      });

      // ─── 4) Return ───
      return res.json({
        status: true,
        message: "Stocks retrieved successfully",
        data: sorted
      });

    } catch (error) {
      console.error("Error in getStocksByExpiry:", error);
      return res
        .status(500)
        .json({ status: false, message: error.message, data: [] });
    }
  }



  async getStocksByExpiryByStrike(req, res) {
    try {
      const { segment, symbol, expiry, optiontype } = req.body;

      // Define matchStage based on the segment
      let matchStage;
      if (segment === "O") {
        matchStage = {
          $match: {
            symbol: symbol,
            segment: segment,
            expiry: expiry,
            option_type: optiontype
          }
        };
      } else {
        matchStage = {
          $match: {
            symbol: symbol,
            segment: segment,
            expiry: expiry
          }
        };
      }

      const pipeline = [
        matchStage, // Add matchStage directly here
        {
          $project: {
            expiry: 1,
            strike: 1, // Include strike for sorting if needed
            stock: "$$ROOT",
            _id: 0
          }
        },
        ...(segment === "O"
          ? [{ $sort: { strike: 1 } }] // Sort by strike in ascending order if segment is "O"
          : [{ $sort: { expiry: 1 } }] // Otherwise, sort by expiry in ascending order
        )
      ];

      // Execute the aggregation
      const result = await Stock_Modal.aggregate(pipeline);

      // Log the result for debugging
      // console.log("Aggregation Result:", JSON.stringify(result, null, 2));

      return res.json({
        status: true,
        message: "Stocks retrieved successfully",
        data: result
      });
    } catch (error) {
      // console.error("Error executing query:", error);
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }


  async activeStock(req, res) {
    try {

      const { } = req.body;

      const result = await Stock_Modal.find({ del: false, status: true });


      return res.json({
        status: true,
        message: "get",
        data: result
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }

  async detailStock(req, res) {
    try {
      // Extract ID from request parameters
      const { id } = req.params;

      // Check if ID is provided
      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Stock ID is required"
        });
      }

      const Stock = await Stock_Modal.findById(id);

      if (!Stock) {
        return res.status(404).json({
          status: false,
          message: "Stock not found"
        });
      }

      return res.json({
        status: true,
        message: "Stock details fetched successfully",
        data: Stock
      });

    } catch (error) {
      // console.log("Error fetching Stock details:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        data: []
      });
    }
  }


  async updateStock(req, res) {
    try {
      const { id, symbol } = req.body;


      if (!symbol) {
        return res.status(400).json({ status: false, message: "symbol is required" });
      }


      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Stock ID is required",
        });
      }

      const updatedStock = await Stock_Modal.findByIdAndUpdate(
        id,
        {
          symbol,
        },
        { stock: true, runValidators: true } // Options: return the updated document and run validators
      );

      if (!updatedStock) {
        return res.status(404).json({
          status: false,
          message: "Stock not found",
        });
      }

      return res.json({
        status: true,
        message: "Stock updated successfully",
        data: updatedStock,
      });

    } catch (error) {
      // console.log("Error updating Stock:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }


  async deleteStock(req, res) {
    try {
      const { id } = req.params; // Extract ID from URL params

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Stock ID is required",
        });
      }


      const deletedStock = await Stock_Modal.findByIdAndUpdate(
        id,
        { del: true }, // Set del to true
        { new: true }  // Return the updated document
      );


      if (!deletedStock) {
        return res.status(404).json({
          status: false,
          message: "Stock not found",
        });
      }

      // console.log("Deleted Stock:", deletedStock);
      return res.json({
        status: true,
        message: "Stock deleted successfully",
        data: deletedStock,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }

  async statusChange(req, res) {
    try {
      const { id, status } = req.body;

      // Validate status
      const validStatuses = ['true', 'false'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          status: false,
          message: "Invalid status value"
        });
      }

      // Find and update the plan
      const result = await Stock_Modal.findByIdAndUpdate(
        id,
        { status: status },
        { new: true } // Return the updated document
      );

      if (!result) {
        return res.status(404).json({
          status: false,
          message: "Stock not found"
        });
      }

      return res.json({
        status: true,
        message: "Status updated successfully",
        data: result
      });

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        data: []
      });
    }
  }
  async AddBulkStock(req, res) {
    try {

      const file = req.file;

      if (!file) {
        return res.status(400).json({
          status: false,
          message: "File is required",
        });
      }

      const ext = path.extname(file.originalname);
      let stocks = [];

      if (ext === '.csv') {
        // Handle CSV file

        stocks = await new Promise((resolve, reject) => {
          const stocks = [];
          require('stream').Readable.from(file.buffer)
            .pipe(require('csv-parser')())
            .on('data', (row) => {
              stocks.push(row);
            })
            .on('end', () => {
              resolve(stocks);
            })
            .on('error', reject);
        });


      } else {
        return res.status(400).json({
          status: false,
          message: "Unsupported file format. Only CSV  files are allowed.",
        });
      }

      const results = [];
      for (let stock of stocks) {
        const { symbol } = stock;

        // Check if the stock symbol already exists
        const existingStock = await Stock_Modal.findOne({ symbol });

        if (existingStock) {
          // Update the existing stock

          await existingStock.save();
          results.push({ symbol, action: 'updated' });
        } else {
          // Add new stock
          const newStock = new Stock_Modal({ symbol });
          await newStock.save();
          results.push({ symbol, action: 'added' });
        }
      }

      return res.json({
        status: true,
        message: "Stocks processed successfully",
        data: results,
      });

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }
  async getStockBySymbol(req, res) {
    try {
      const { symbol } = req.body;

      // Build the match stage dynamically if a symbol is provided
      const matchStage = symbol
        ? { $match: { segment: "C", symbol: { $regex: symbol, $options: 'i' } } }
        : { $match: {} }; // Match all documents if no symbol is provided

      const result = await Stock_Modal.aggregate([
        matchStage, // Match stage (optional filtering)
        {
          $group: {
            _id: "$symbol", // Grouping by symbol
            data: { $push: "$$ROOT" } // Include all fields in the group result
          }
        }
      ]);

      return res.json({
        status: true,
        message: "Data retrieved successfully",
        data: result
      });
    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }




}




module.exports = new Stock();