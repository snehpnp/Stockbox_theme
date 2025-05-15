const db = require("../Models");
const multer = require('multer');
const xlsx = require('xlsx');
const csv = require('csv-parser');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
var dateTime = require('node-datetime');
const Stockrating_Modal = db.Stockrating;



class Stockrating {

  async AddStockrating(req, res) {
    try {
      const { symbol, valuation, trust, technicals, financial, overall } = req.body;

      if (!symbol) {
        return res.status(400).json({ status: false, message: "symbol is required" });
      }


      const existingSymbol = await Stockrating_Modal.findOne({ symbol,del:false});
      if (existingSymbol) {
        return res.status(400).json({
          status: false,
          message: "symbol already exists",
        });
      }

      const result = new Stockrating_Modal({
        symbol,
        valuation,
        trust,
        technicals,
        financial,
        overall
      });

      await result.save();

      return res.json({
        status: true,
        message: "Stock rating added successfully",
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


  async getStockrating(req, res) {
    try {

      const { } = req.body;

      const result = await Stockrating_Modal.find({ del: false });

      return res.json({
        status: true,
        message: "get",
        data: result
      });

    } catch (error) {
      return res.json({ status: false, message: "Server error", data: [] });
    }
  }

  async updateStockrating(req, res) {
    try {
      const { id, symbol, valuation, trust, technicals, financial, overall } = req.body;


      if (!symbol) {
        return res.status(400).json({ status: false, message: "symbol is required" });
      }


      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Stock rating ID is required",
        });
      }

      const updatedStock = await Stockrating_Modal.findByIdAndUpdate(
        id,
        {
          symbol,
          valuation,
          trust,
          technicals,
          financial,
          overall
        },
        { stock: true, runValidators: true } // Options: return the updated document and run validators
      );

      if (!updatedStock) {
        return res.status(404).json({
          status: false,
          message: "Stock rating not found",
        });
      }

      return res.json({
        status: true,
        message: "Stock rating updated successfully",
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


  async deleteStockrating(req, res) {
    try {
      const { id } = req.params; // Extract ID from URL params

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Stock rating ID is required",
        });
      }


      const deletedStock = await Stockrating_Modal.findByIdAndUpdate(
        id,
        { del: true }, // Set del to true
        { new: true }  // Return the updated document
      );


      if (!deletedStock) {
        return res.status(404).json({
          status: false,
          message: "Stock rating not found",
        });
      }

      // console.log("Deleted Stock:", deletedStock);
      return res.json({
        status: true,
        message: "Stock rating deleted successfully",
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


}




module.exports = new Stockrating();