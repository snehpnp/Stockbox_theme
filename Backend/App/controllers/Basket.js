const db = require("../Models");
const mongoose = require('mongoose');
const csv = require('csv-parser');
const path = require('path');
const { Readable } = require('stream');
const upload = require('../Utils/multerHelper'); 
const multer = require('multer');

const puppeteer = require('puppeteer');
const fs = require('fs');
const { toWords } = require('number-to-words');


const Basket_Modal = db.Basket;
const Basketstock_Modal = db.Basketstock;
const Stock_Modal = db.Stock;
const Liveprice_Modal = db.Liveprice;
const BasketSubscription_Modal = db.BasketSubscription;
const Clients_Modal = db.Clients;
const BasicSetting_Modal = db.BasicSetting;
const Mailtemplate_Modal = db.Mailtemplate;
const PlanSubscription_Modal = db.PlanSubscription;
const States = db.States;
const City = db.City;

const { addBasketVolatilityData } = require("./Cron"); 
const Basketghaphdata_Modal = require("../Models/Basketgraphdata");


class Basket {


  async AddBasket(req, res) {
    try {


      await new Promise((resolve, reject) => {
        upload('basket').fields([{ name: 'image', maxCount: 1 }])(req, res, (err) => {
            if (err) {
                return reject(err);
            }

            resolve();
        });
    });
     
     
      const image = req.files['image'] ? req.files['image'][0].filename : null;

      const { title, description, full_price, basket_price, mininvamount, themename, accuracy, portfolioweightage, cagr, frequency, validity, next_rebalance_date, type, add_by, short_description, rationale, methodology,url } = req.body;


      const result = new Basket_Modal({
        title,
        description,
        basket_price,
        mininvamount,
        themename,
      //  accuracy,
      //  portfolioweightage,
        add_by,
        cagr:"0",
        cagr_live:"0",
        frequency,
        validity,
        next_rebalance_date,
        full_price,
        type,
        image,
        short_description,
        rationale,
        methodology,
        url

      });


      await result.save();

      return res.json({
        status: true,
        message: "Basket added successfully",
        data: result,
      });
    } catch (error) {
      // console.log("Error adding Basket:", error);

      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }

  async AddStockInBasket(req, res) {
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
        stocks = await new Promise((resolve, reject) => {
          const stocks = [];
          Readable.from(file.buffer)
            .pipe(csv())
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
          message: "Unsupported file format. Only CSV files are allowed.",
        });
      }

      const { basket_id } = req.body; // Get basket_id from the request body

      // Validate basket existence
      const basket = await Basket_Modal.findById(basket_id);
      if (!basket) {
        return res.status(400).json({
          status: false,
          message: "Basket not found.",
        });
      }


      const existingStocks = await Basketstock_Modal.find({ basket_id }).sort({ version: -1 });

      let totalAmount = 0;

      if (existingStocks && existingStocks.length > 0) {
        let totalSum = 0;

        for (const stock of existingStocks) {
          const tradeSymbol = stock.tradesymbol;
          const quantity = stock.quantity;

          // Fetch the instrument token from the Stocks table
          const stockData = await Stock_Modal.findOne({ tradesymbol: tradeSymbol });

          if (stockData) {
            const instrumentToken = stockData.instrument_token;

            // Fetch the live price using the instrument token from StockLivePrices
            const livePrice = await Liveprice_Modal.findOne({ token: instrumentToken });

            if (livePrice) {
              const lpPrice = livePrice.lp;

              // Multiply lp_price by quantity and add to the total sum
              totalSum += lpPrice * quantity;
            } else {
              console.log(`Live price not found for instrument token: ${instrumentToken}`);
            }
          } else {
            console.log(`Stock data not found for trade symbol: ${tradeSymbol}`);
          }
        }

        totalAmount = totalSum;
      } else {
        // Set the total amount to the basket's minimum investment amount if no stocks exist
        totalAmount = basket.mininvamount;
      }



      // const marketPrices = {
      //   'AAPL': 150,
      //   'GOOGL': 2800,
      //   'MSFT': 300,
      //   'TSLA': 700,
      // };

      let remainingAmount = totalAmount; // Keep track of remaining amount
      const bulkOps = [];

      for (const stock of stocks) {
        const { name, tradesymbol, percentage, price, comment, type } = stock;

        const currentPrice = price;
        if (!currentPrice) {
          return res.status(400).json({
            status: false,
            message: `No market price found for ${tradesymbol}`,
          });
        }

        // Calculate allocation
        const allocatedAmount = (percentage / 100) * totalAmount;
        if (allocatedAmount > remainingAmount) {
          return res.status(400).json({
            status: false,
            message: `Insufficient funds to allocate ${allocatedAmount} for ${tradesymbol}`,
          });
        }

        // Calculate quantity and total value
        const quantity = Math.floor(allocatedAmount / currentPrice);
        const total_value = quantity * currentPrice;

        // Deduct from remaining amount
        remainingAmount -= total_value;

        // Find the latest version of the stock in the basket
        const version = existingStocks.length > 0 ? existingStocks[0].version + 1 : 1;

        // Prepare data for bulk insertion
        bulkOps.push({
          insertOne: {
            document: {
              basket_id,
              name,
              tradesymbol,
              price: currentPrice,
              total_value,
              quantity,
              type,
              comment: comment || '',
              version,
              weightage: percentage,
            },
          },
        });
      }

      // Execute the bulk insert
      const result = await Basketstock_Modal.bulkWrite(bulkOps);

      return res.json({
        status: true,
        message: "Stocks added successfully.",
        data: result,
      });
    } catch (error) {
      // console.error("Error adding stocks:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }

  async AddStockInBasketForm(req, res) {
    try {
      const { basket_id, stocks, publishstatus, comments, stockname } = req.body; // Get basket_id and stocks from the request body

      // Validate basket existence
      const basket = await Basket_Modal.findById(basket_id);
      if (!basket) {
        return res.status(400).json({
          status: false,
          message: "Basket not found.",
        });
      }
   // const existingStocks = await Basketstock_Modal.find({ basket_id }).sort({ version: -1 });


    const latestVersion = await Basketstock_Modal.aggregate([
      { $match: { basket_id, status: 1 } }, // Filter by basket_id and status
      { $group: { _id: null, maxVersion: { $max: "$version" } } }
    ]);
     
     
    let existingStocks = []; // Initialize as an empty array
      if (latestVersion.length > 0) {
        const maxVersion = latestVersion[0].maxVersion;
      
        // Fetch stocks with the latest version and status 1
         existingStocks = await Basketstock_Modal.find({
          basket_id,
          status: 1,
          version: maxVersion
        });
      }


  if(publishstatus==true) {
      const checkpublishornot = await Basketstock_Modal.find({ basket_id, status: 1 });
      if (checkpublishornot.length > 0) {
      } else {
        basket.status =true;
        basket.publishstatus =true;
        await basket.save();
      }
    }

      let totalAmount = 0;

      if (existingStocks && existingStocks.length > 0) {

        if (existingStocks[0].status == 0) {
          return res.status(500).json({
            status: false,
            message: "Please Public Old Stock First Than New Create",
          });
        }
        else {
            

          // basket.status = true;
          // await basket.save();

          let totalSum = 0;

          for (const stock of existingStocks) {
            const tradeSymbol = stock.tradesymbol;
            const quantity = stock.quantity;
      
            // Fetch the instrument token from the Stocks table
            const stockData = await Stock_Modal.findOne({ tradesymbol: tradeSymbol });
           
            if (stockData) {
              const instrumentToken = stockData.instrument_token;
             
              // Fetch the live price using the instrument token from StockLivePrices
              const livePrice = await Liveprice_Modal.findOne({ token: instrumentToken });

            

              if (livePrice) {
                const lpPrice = livePrice.lp;
               
                // Multiply lp_price by quantity and add to the total sum
                totalSum += lpPrice * quantity;
              } else {
                console.log(`Live price not found for instrument token: ${instrumentToken}`);
              }
            } else {
              console.log(`Stock data not found for trade symbol: ${tradeSymbol}`);
            }
          }

          totalAmount = totalSum;
        }
      } else {
        // Set the total amount to the basket's minimum investment amount if no stocks exist
        totalAmount = basket.mininvamount;
      }

     
      let remainingAmount = totalAmount; // Keep track of remaining amount

      if (!Array.isArray(stocks) || stocks.length === 0) {
        return res.status(400).json({
          status: false,
          message: "Stocks data is required and should be an array.",
        });
      }

      const bulkOps = [];

      for (const stock of stocks) {
        const { name, tradesymbol, percentage, price, comment, type, status } = stock;

        const currentPrice = price;
        if (!currentPrice) {
          return res.status(400).json({
            status: false,
            message: `No market price found for ${tradesymbol}`,
          });
        }


        const stockDatas = await Stock_Modal.findOne({ tradesymbol: tradesymbol });
           
          const instrumentTokens = stockDatas.instrument_token;

        const existingDocument = await Liveprice_Modal.findOne({ token: instrumentTokens });

        if (existingDocument) {
        } else {
            await Liveprice_Modal.create({
                token: instrumentTokens,
                lp: currentPrice,
                exc: "NSE",
                curtime: `${new Date().getHours().toString().padStart(2, '0')}${new Date().getMinutes().toString().padStart(2, '0')}`,
                ft: "1234566"
            });
        }
        
        const allocatedAmount = (percentage / 100) * totalAmount;
        if (allocatedAmount > remainingAmount) {
          return res.status(400).json({
            status: false,
            message: `Insufficient funds to allocate ${allocatedAmount} for ${tradesymbol}`,
          });
        }

        // Calculate quantity and total value
        const quantity = Math.floor(allocatedAmount / currentPrice);
        const total_value = quantity * currentPrice;

        // Deduct from remaining amount
        remainingAmount -= total_value;

        // Find the latest version of the stock in the basket

        const version = existingStocks.length > 0 ? existingStocks[0].version + 1 : 1;


        bulkOps.push({
          insertOne: {
            document: {
              basket_id,
              name,
              tradesymbol,
              price: currentPrice,
              total_value,
              quantity,
              type,
              comment: comments || '',
              version,
              weightage: percentage,
              status: status,
            },
          },
        });
      }

      // Execute the bulk insert
      const result = await Basketstock_Modal.bulkWrite(bulkOps);
      const updatedBasket = await Basket_Modal.findByIdAndUpdate(
        basket_id, 
        { stockname: stockname }, 
        { new: true }  // Ye ensure karega ki updated document return ho
    );

      if (publishstatus == 1) {
      
        await addBasketVolatilityData(req);
      }

      return res.json({
        status: true,
        message: "Stocks added successfully.",
        data: result,
      });


    } catch (error) {
      // console.error("Error adding stocks:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }



  async AddStockInBasketFormClient(req, res) {
      try {
          const { basket_id, stocks, publishstatus, comments } = req.body;
  
          // Validate basket existence
          const basket = await Basket_Modal.findById(basket_id);
          if (!basket) {
              return res.status(400).json({
                  status: false,
                  message: "Basket not found.",
              });
          }
  
          // Fetch latest version for the basket
          const latestVersion = await Basketstock_Modal.aggregate([
              { $match: { basket_id, status: 1 } },
              { $group: { _id: null, maxVersion: { $max: "$version" } } }
          ]);
  
          let existingStocks = [];
          if (latestVersion.length > 0) {
              const maxVersion = latestVersion[0].maxVersion;
              existingStocks = await Basketstock_Modal.find({ basket_id, status: 1, version: maxVersion });
          }
  
          // Publish status check
          if (publishstatus === true) {
              const checkpublishornot = await Basketstock_Modal.find({ basket_id, status: 1 });
              if (checkpublishornot.length === 0) {
                  basket.status = true;
                  basket.publishstatus = true;
                  await basket.save();
              }
          }
  
          let totalAmount = existingStocks.length > 0 ? existingStocks.reduce((sum, stock) => sum + stock.total_value, 0) : basket.mininvamount;
          let remainingAmount = totalAmount;
  
          if (!Array.isArray(stocks) || stocks.length === 0) {
              return res.status(400).json({
                  status: false,
                  message: "Stocks data is required and should be an array.",
              });
          }
  
          // 🔹 Fetch Company Master Data
          const response = await fetch("http://stockboxapis.cmots.com/api/CompanyMaster");
          const companyMasterData = await response.json();

          
          // Convert API response to a dictionary for faster lookup
          const companyLookup = {};
          for (const company of companyMasterData.data) {
              companyLookup[company.NSESymbol] = company.mcaptype;
          }
          const bulkOps = [];
  
          for (const stock of stocks) {
              const { name, tradesymbol, percentage, price, comment, status } = stock;
  
              const currentPrice = price;
              if (!currentPrice) {
                  return res.status(400).json({
                      status: false,
                      message: `No market price found for ${tradesymbol}`,
                  });
              }
  
              const stockDatas = await Stock_Modal.findOne({ tradesymbol });
              const instrumentTokens = stockDatas ? stockDatas.instrument_token : null;
  
              if (instrumentTokens) {
                  const existingDocument = await Liveprice_Modal.findOne({ token: instrumentTokens });
                  if (!existingDocument) {
                      await Liveprice_Modal.create({
                          token: instrumentTokens,
                          lp: currentPrice,
                          exc: "NSE",
                          curtime: `${new Date().getHours().toString().padStart(2, '0')}${new Date().getMinutes().toString().padStart(2, '0')}`,
                          ft: "1234566"
                      });
                  }
              }
  
              // 🔹 Find MCAP Type from API Data using lookup
              const mcapType = companyLookup[name] || "Small Cap";
  
              const allocatedAmount = (percentage / 100) * totalAmount;
              if (allocatedAmount > remainingAmount) {
                  return res.status(400).json({
                      status: false,
                      message: `Insufficient funds to allocate ${allocatedAmount} for ${tradesymbol}`,
                  });
              }
  
              // Calculate quantity and total value
              const quantity = Math.floor(allocatedAmount / currentPrice);
              const total_value = quantity * currentPrice;
  
              remainingAmount -= total_value;
  
              const version = existingStocks.length > 0 ? existingStocks[0].version + 1 : 1;
  
              bulkOps.push({
                  insertOne: {
                      document: {
                          basket_id,
                          name,
                          tradesymbol,
                          price: currentPrice,
                          total_value,
                          quantity,
                          type: mcapType,  // ✅ Inserted MCAP Type
                          comment: comments || '',
                          version,
                          weightage: percentage,
                          status,
                      },
                  },
              });
          }
  
          // Execute the bulk insert
          const result = await Basketstock_Modal.bulkWrite(bulkOps);
          if (publishstatus == 1) {
            await addBasketVolatilityData(req);
          }
          return res.json({
              status: true,
              message: "Stocks added successfully with MCAP Type.",
              data: result,
          });
  
      } catch (error) {
          return res.status(500).json({
              status: false,
              message: "Server error",
              error: error.message,
          });
      }
  }
  


  async UpdateStockInBasketForm(req, res) {
    try {
      const { basket_id, stocks, version, publishstatus, comments, stockname } = req.body; // Include version in request body

      // Validate basket existence
      const basket = await Basket_Modal.findById(basket_id);
      if (!basket) {
        return res.status(400).json({
          status: false,
          message: "Basket not found.",
        });
      }



      const latestVersion = await Basketstock_Modal.aggregate([
        { $match: { basket_id, status: 1 } }, // Filter by basket_id and status
        { $group: { _id: null, maxVersion: { $max: "$version" } } }
      ]);
       
       
      let existingStocks = []; // Initialize as an empty array
        if (latestVersion.length > 0) {
          const maxVersion = latestVersion[0].maxVersion;
        
          // Fetch stocks with the latest version and status 1
           existingStocks = await Basketstock_Modal.find({
            basket_id,
            status: 1,
            version: maxVersion
          });
        }
  


      
  if(publishstatus==true) {
    const checkpublishornot = await Basketstock_Modal.find({ basket_id, status: 1 });
    if (checkpublishornot.length > 0) {
    } else {
      basket.status =true;
      basket.publishstatus =true;
      await basket.save();
    }
  }


  await Basketstock_Modal.deleteMany({ basket_id, version });


  let totalAmount = 0;

  if (existingStocks && existingStocks.length > 0) {

    if (existingStocks[0].status == 0) {
      return res.status(500).json({
        status: false,
        message: "Please Public Old Stock First Than New Create",
      });
    }
    else {
        

      // basket.status = true;
      // await basket.save();

      let totalSum = 0;

      for (const stock of existingStocks) {
        const tradeSymbol = stock.tradesymbol;
        const quantity = stock.quantity;
  
        // Fetch the instrument token from the Stocks table
        const stockData = await Stock_Modal.findOne({ tradesymbol: tradeSymbol });
       
        if (stockData) {
          const instrumentToken = stockData.instrument_token;
         
          // Fetch the live price using the instrument token from StockLivePrices
          const livePrice = await Liveprice_Modal.findOne({ token: instrumentToken });

        

          if (livePrice) {
            const lpPrice = livePrice.lp;
           
            // Multiply lp_price by quantity and add to the total sum
            totalSum += lpPrice * quantity;
          } else {
            console.log(`Live price not found for instrument token: ${instrumentToken}`);
          }
        } else {
          console.log(`Stock data not found for trade symbol: ${tradeSymbol}`);
        }
      }

      totalAmount = totalSum;
    }
  } else {
    // Set the total amount to the basket's minimum investment amount if no stocks exist
    totalAmount = basket.mininvamount;
  }

 
  let remainingAmount = totalAmount; // Keep track of remaining amount

  if (!Array.isArray(stocks) || stocks.length === 0) {
    return res.status(400).json({
      status: false,
      message: "Stocks data is required and should be an array.",
    });
  }


  const bulkOps = [];

  for (const stock of stocks) {
    const { name, tradesymbol, percentage, price, comment, type, status } = stock;

    const currentPrice = price;
    if (!currentPrice) {
      return res.status(400).json({
        status: false,
        message: `No market price found for ${tradesymbol}`,
      });
    }

    const stockDatas = await Stock_Modal.findOne({ tradesymbol: tradesymbol });
           
    const instrumentTokens = stockDatas.instrument_token;

  const existingDocument = await Liveprice_Modal.findOne({ token: instrumentTokens });

  if (existingDocument) {
  } else {
      await Liveprice_Modal.create({
          token: instrumentTokens,
          lp: currentPrice,
          exc: "NSE",
          curtime: `${new Date().getHours().toString().padStart(2, '0')}${new Date().getMinutes().toString().padStart(2, '0')}`,
          ft: "1234566"
      });
  }


    // Calculate allocation
    const allocatedAmount = (percentage / 100) * totalAmount;
    if (allocatedAmount > remainingAmount) {
      return res.status(400).json({
        status: false,
        message: `Insufficient funds to allocate ${allocatedAmount} for ${tradesymbol}`,
      });
    }

    // Calculate quantity and total value
    const quantity = Math.floor(allocatedAmount / currentPrice);
    const total_value = quantity * currentPrice;

    // Deduct from remaining amount
    remainingAmount -= total_value;

    // Find the latest version of the stock in the basket

    const version = existingStocks.length > 0 ? existingStocks[0].version + 1 : 1;


    bulkOps.push({
      insertOne: {
        document: {
          basket_id,
          name,
          tradesymbol,
          price: currentPrice,
          total_value,
          quantity,
          type,
          comment: comments || '',
          version,
          weightage: percentage,
          status: status,
        },
      },
    });
  }
    

      // Execute the bulk upsert
      const result = await Basketstock_Modal.bulkWrite(bulkOps);
      const updatedBasket = await Basket_Modal.findByIdAndUpdate(
        basket_id, 
        { stockname: stockname }, 
        { new: true }  // Ye ensure karega ki updated document return ho
    );
      if (publishstatus == 1) {
      
        await addBasketVolatilityData(req);
      }


      return res.json({
        status: true,
        message: "Stocks updated successfully.",
        data: result,
      });
    } catch (error) {
      // console.error("Error updating stocks:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }


  async UpdateStockInBasketFormClient(req, res) {
    try {
      const { basket_id, stocks, version, publishstatus, comments } = req.body;
  
      // Validate basket existence
      const basket = await Basket_Modal.findById(basket_id);
      if (!basket) {
        return res.status(400).json({
          status: false,
          message: "Basket not found.",
        });
      }
  
      // Fetch CompanyMaster Data
      const response = await fetch("http://stockboxapis.cmots.com/api/CompanyMaster");
      const companyMasterData = await response.json();
  
      // Create lookup object for `type` (mcaptype)
      const companyLookup = {};
      if (companyMasterData && Array.isArray(companyMasterData.data)) {
        for (const company of companyMasterData.data) {
          if (company.NSESymbol && company.mcaptype) {
            companyLookup[company.NSESymbol.trim()] = company.mcaptype.trim();
          }
        }
      }
  
      let existingStocks = [];
      const latestVersion = await Basketstock_Modal.aggregate([
        { $match: { basket_id, status: 1 } },
        { $group: { _id: null, maxVersion: { $max: "$version" } } }
      ]);
  
      if (latestVersion.length > 0) {
        const maxVersion = latestVersion[0].maxVersion;
        existingStocks = await Basketstock_Modal.find({
          basket_id,
          status: 1,
          version: maxVersion
        });
      }
  
      if (publishstatus == true) {
        const checkpublishornot = await Basketstock_Modal.find({ basket_id, status: 1 });
        if (checkpublishornot.length === 0) {
          basket.status = true;
          basket.publishstatus = true;
          await basket.save();
        }
      }
  
      await Basketstock_Modal.deleteMany({ basket_id, version });
  
      let totalAmount = existingStocks.length > 0 ? existingStocks.reduce((sum, stock) => sum + (stock.price * stock.quantity), 0) : basket.mininvamount;
  
      let remainingAmount = totalAmount;
      if (!Array.isArray(stocks) || stocks.length === 0) {
        return res.status(400).json({
          status: false,
          message: "Stocks data is required and should be an array.",
        });
      }
  
      const bulkOps = [];
      for (const stock of stocks) {
        const { name, tradesymbol, percentage, price, comment, status } = stock;
  
        // Get `type` from API
        const type = companyLookup[name] || "Small Cap";
  
        const currentPrice = price;
        if (!currentPrice) {
          return res.status(400).json({
            status: false,
            message: `No market price found for ${tradesymbol}`,
          });
        }
  
        const stockDatas = await Stock_Modal.findOne({ tradesymbol: tradesymbol });
        const instrumentTokens = stockDatas?.instrument_token;
  
        if (instrumentTokens) {
          const existingDocument = await Liveprice_Modal.findOne({ token: instrumentTokens });
  
          if (!existingDocument) {
            await Liveprice_Modal.create({
              token: instrumentTokens,
              lp: currentPrice,
              exc: "NSE",
              curtime: `${new Date().getHours().toString().padStart(2, '0')}${new Date().getMinutes().toString().padStart(2, '0')}`,
              ft: "1234566"
            });
          }
        }
  
        // Calculate allocation
        const allocatedAmount = (percentage / 100) * totalAmount;
        if (allocatedAmount > remainingAmount) {
          return res.status(400).json({
            status: false,
            message: `Insufficient funds to allocate ${allocatedAmount} for ${tradesymbol}`,
          });
        }
  
        const quantity = Math.floor(allocatedAmount / currentPrice);
        const total_value = quantity * currentPrice;
        remainingAmount -= total_value;
  
        const version = existingStocks.length > 0 ? existingStocks[0].version + 1 : 1;
  
        bulkOps.push({
          insertOne: {
            document: {
              basket_id,
              name,
              tradesymbol,
              price: currentPrice,
              total_value,
              quantity,
              type, // ✅ Insert `type` from API
              comment: comments || '',
              version,
              weightage: percentage,
              status: status,
            },
          },
        });
      }
  
      // Execute the bulk insert
      const result = await Basketstock_Modal.bulkWrite(bulkOps);
      if (publishstatus == 1) {
        await addBasketVolatilityData(req);
      }
      return res.json({
        status: true,
        message: "Stocks updated successfully.",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }
  


  /*
  async getBasket(req, res) {
    try {

     //   const baskets = await Basket_Modal.find({ del: false,status:false }).sort({ created_at: -1 });
       
     const baskets = await Basket_Modal.aggregate([
       {
        $match: {
          del: false,                     // Include only non-deleted baskets
          status: false                    // Include only active baskets
        }
      },
      {
        $lookup: {
          from: "basketstocks",
          let: { basketId: { $toString: "$_id" } }, // Convert _id to string
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$basket_id", "$$basketId"] } // Compare with basketstocks.basket_id
              }
            }
          ],
          as: "stock_details"
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          themename: 1,
          add_by: 1,
          full_price: 1,
          basket_price: 1,
          mininvamount: 1,
          accuracy: 1,
          portfolioweightage: 1,
          cagr: 1,
          frequency: 1,
          validity: 1,
          next_rebalance_date: 1,
          stock_details: {
            $filter: {
              input: "$stock_details",      // Filter the joined stock details
              as: "stock",
              cond: { $eq: ["$$stock.del", false] } // Exclude deleted stocks
            }
          },
          created_at: 1,
          updated_at: 1
        }
      },
      {
        $sort: { created_at: -1 }         // Sort by creation date
      }
    ]);
     
     return res.json({
            status: true,
            message: "Baskets fetched successfully",
            data: baskets
        });

    } catch (error) {
        // console.log("An error occurred:", error);
        return res.json({ 
            status: false, 
            message: "Server error", 
            data: [] 
        });
    }
}
*/
  async getBasket(req, res) {
    try {
      const { search, page = 1, limit = 10 } = req.body; // Get search term, page, and limit from request body
      const pageNumber = parseInt(page);
      const pageSize = parseInt(limit);

      const matchConditions = {
        del: false, // Include only non-deleted baskets
        status: false // Include only active baskets
      };

      // If there's a search term, include it in the match conditions
      if (search) {
        const searchRegex = new RegExp(search, "i"); // Create a case-insensitive regex for the search term
        matchConditions.$or = [
          { title: { $regex: searchRegex } },
          { themename: { $regex: searchRegex } }
        ];
      }

      const baskets = await Basket_Modal.aggregate([
        {
          $match: matchConditions // Apply dynamic search conditions
        },
        {
          $lookup: {
            from: "basketstocks",
            let: { basketId: { $toString: "$_id" } }, // Convert _id to string
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$basket_id", "$$basketId"] } // Compare with basketstocks.basket_id
                }
              }
            ],
            as: "stock_details"
          }
        },
        {
          $project: {
            _id: 1,
            title: 1,
            description: 1,
            themename: 1,
            add_by: 1,
            full_price: 1,
            basket_price: 1,
            mininvamount: 1,
            accuracy: 1,
            portfolioweightage: 1,
            cagr: 1,
            frequency: 1,
            validity: 1,
            next_rebalance_date: 1,
            rebalancestatus: 1,
            stock_details: {
              $filter: {
                input: "$stock_details", // Filter the joined stock details
                as: "stock",
                cond: { $eq: ["$$stock.del", false] } // Exclude deleted stocks
              }
            },
            created_at: 1,
            updated_at: 1
          }
        },
        { $sort: { created_at: -1 } }, // Sort by creation date
        { $skip: (pageNumber - 1) * pageSize }, // Skip documents for pagination
        { $limit: pageSize } // Limit the number of documents
      ]);

      const totalBaskets = await Basket_Modal.countDocuments(matchConditions); // Count matching documents



      return res.json({
        status: true,
        message: "Baskets fetched successfully",
        data: baskets,
        pagination: {
          totalRecords: totalBaskets,
          totalPages: pageNumber,
          page: parseInt(page),
          limit: parseInt(pageSize)
        }
      });




    } catch (error) {
      console.error("An error occurred:", error);
      return res.json({
        status: false,
        message: "Server error",
        data: []
      });
    }
  }



  async activeBasket(req, res) {
    try {

      const baskets = await Basket_Modal.find({ del: false, status: true, publishstatus:true }).sort({ created_at: -1 });

      return res.json({
        status: true,
        message: "Baskets fetched successfully",
        data: baskets
      });

    } catch (error) {
      return res.json({
        status: false,
        message: "Server error",
        data: []
      });
    }
  }

  async activeBasketList(req, res) {
    try {
      const { search, page = 1, limit = 10 } = req.body; // Get search term, page, and limit from query params
      const pageNumber = parseInt(page);
      const pageSize = parseInt(limit);
      const matchConditions = {
        del: false, // Include only non-deleted baskets
        status: true // Include only active baskets
      };

      // If there's a search term, include it in the match conditions
      if (search) {
        const searchRegex = new RegExp(search, "i"); // Create a case-insensitive regex for the search term
        matchConditions.$or = [
          { title: { $regex: searchRegex } },
          { themename: { $regex: searchRegex } }
        ];
      }

      let baskets = await Basket_Modal.find(matchConditions)
      .sort({ created_at: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();
    
    baskets = await Promise.all(
      baskets.map(async (basket) => {
        const stockCount = await Basketstock_Modal.countDocuments({
          basket_id: basket._id,
          status: 0
        });
        return {
          ...basket,
          stockstatus: stockCount > 0 ? 0 : 1
        };
      })
    );

      // Count total active baskets (filtered by search, if applicable)
      const totalBaskets = await Basket_Modal.countDocuments(matchConditions);


      return res.json({
        status: true,
        message: "Active baskets fetched successfully",
        data: baskets,
        pagination: {
          totalRecords: totalBaskets,
          totalPages: pageNumber,
          page: parseInt(page),
          limit: parseInt(pageSize)
        }
      });


    } catch (error) {
      console.error("An error occurred:", error);
      return res.json({
        status: false,
        message: "Server error",
        data: []
      });
    }
  }


  async detailBasket(req, res) {
    try {
      // Extract ID from request parameters
      const { id } = req.params;

      // Check if ID is provided
      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Basket ID is required"
        });
      }

      // Find the basket by ID
      const basket = await Basket_Modal.findById(id);

      // Check if the basket is found
      if (!basket) {
        return res.status(404).json({
          status: false,
          message: "Basket not found"
        });
      }

      // Split the data by '##'

      // Return the basket details along with grouped data
      return res.json({
        status: true,
        message: "Basket details fetched successfully",
        data: basket
      });

    } catch (error) {
      // console.log("Error fetching Basket details:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        data: []
      });
    }
  }


  async updateBasket(req, res) {
    try {


      await new Promise((resolve, reject) => {
        upload('basket').fields([{ name: 'image', maxCount: 1 }])(req, res, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });

    const { id, title, description, full_price, basket_price, mininvamount, themename, accuracy, portfolioweightage, cagr, frequency, validity, next_rebalance_date, type, short_description, rationale, methodology,url } = req.body;


      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Basket ID is required",
        });
      }


    // if(full_price){
    // const basket_prices = full_price;
    // const full_prices = basket_price;
    // }
    // else
    // {
    //   const basket_prices = basket_price;
    //   const full_prices = full_price;
    // }
    const image = req.files && req.files['image'] ? req.files['image'][0].filename : null;

      const updatedBasket = await Basket_Modal.findByIdAndUpdate(
        id,
        {
          title,
          description,
          basket_price,
          mininvamount,
          themename,
      //    accuracy,
      //    portfolioweightage,
          cagr,
          frequency,
          validity,
          next_rebalance_date,
          full_price,
          type,
          image,
          short_description,
          rationale,
          methodology,
          url
        },
        { Basket: true, runValidators: true } // Options: return the updated document and run validators
      );

      if (!updatedBasket) {
        return res.status(404).json({
          status: false,
          message: "Basket not found",
        });
      }

      // console.log("Updated Basket:", updatedBasket);
      return res.json({
        status: true,
        message: "Basket updated successfully",
        data: updatedBasket,
      });

    } catch (error) {
      // console.log("Error updating Basket:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }


  async deleteBasket(req, res) {
    try {
      const { id } = req.params; // Extract ID from URL params

      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Basket ID is required",
        });
      }

      //const deletedBasket = await Basket_Modal.findByIdAndDelete(id);
      const deletedBasket = await Basket_Modal.findByIdAndUpdate(
        id,
        { del: true }, // Set del to true
        { Basket: true }  // Return the updated document
      );

      if (!deletedBasket) {
        return res.status(404).json({
          status: false,
          message: "Basket not found",
        });
      }

      // console.log("Deleted Basket:", deletedBasket);
      return res.json({
        status: true,
        message: "Basket deleted successfully",
        data: deletedBasket,
      });
    } catch (error) {
      // console.log("Error deleting Basket:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  }
  // Ensure this is at the top level of your file, not inside another function or block
  async statusChange(req, res) {
    try {
      const { id, status } = req.body;

      // Validate status
      const validStatuses = [true, false];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          status: false,
          message: "Invalid status value"
        });
      }

      // Find and update the Basket
      const result = await Basket_Modal.findByIdAndUpdate(
        id,
        { status: status,publishstatus:status },
        { new: true } // Return the updated document
      );

      if (!result) {

        return res.status(404).json({
          status: false,
          message: "Basket not found"
        });
      }

      if (result) {
        const updateStocks = await Basketstock_Modal.updateMany(
          { basket_id: id, del: false },
          { $set: { status: 1 } }
        );
      }

      return res.json({
        status: true,
        message: "Status updated successfully",
        data: result
      });

    } catch (error) {
      // console.log("Error updating status:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        data: []
      });
    }
  }

  async statusPublishChange(req, res) {
    try {
      const { id, status } = req.body;

      // Validate status
      const validStatuses = [true, false];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          status: false,
          message: "Invalid status value"
        });
      }

      // Find and update the Basket
      const result = await Basket_Modal.findByIdAndUpdate(
        id,
        { publishstatus:status },
        { new: true } // Return the updated document
      );

      if (!result) {
        return res.status(404).json({
          status: false,
          message: "Basket not found"
        });
      }

      return res.json({
        status: true,
        message: "Status updated successfully",
        data: result
      });

    } catch (error) {
      // console.log("Error updating status:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        data: []
      });
    }
  }


  async statusRebanceChange(req, res) {
    try {
      const { id, status } = req.body;

      // Validate status
      const validStatuses = [true, false];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          status: false,
          message: "Invalid status value"
        });
      }

      // Find and update the Basket
      const result = await Basket_Modal.findByIdAndUpdate(
        id,
        { rebalancestatus: status },
        { new: true } // Return the updated document
      );

      if (!result) {
        return res.status(404).json({
          status: false,
          message: "Basket not found"
        });
      }

      return res.json({
        status: true,
        message: "Status updated successfully",
        data: result
      });

    } catch (error) {
      // console.log("Error updating status:", error);
      return res.status(500).json({
        status: false,
        message: "Server error",
        data: []
      });
    }
  }


  async getBasketstockList(req, res) {
    try {
      const { id } = req.params;
      const basketstocks = await Basketstock_Modal.find({ del: false, basket_id: id });
      const basket = await Basket_Modal.findOne({ del: false, _id: id });

    // Check karein agar basket exist nahi karta
    if (!basket) {
      return res.json({
        status: false,
        message: "Basket not found",
        data: [],
      });
    }


      return res.json({
        status: true,
        message: "Basketstocks fetched successfully",
        data: basketstocks,
        stockname: basket.stockname
      });

    } catch (error) {
      // console.log("An error occurred:", error);
      return res.json({
        status: false,
        message: "Server error",
        data: []
      });
    }
  }



  async addBasketSubscription(req, res) {
    try {
      const { basket_id, client_id, price } = req.body;

      // Validate input
      if (!basket_id || !client_id) {
        return res.status(400).json({ status: false, message: 'Missing required fields' });
      }


      const client = await Clients_Modal.findOne({ _id: client_id, del: 0, ActiveStatus: 1 });
      if (!client) {
        return res.status(400).json({ status: false, message: 'Client Not Actived' });
      }


      const basket = await Basket_Modal.findOne({
        _id: basket_id,
        del: false
      });



      // Map plan validity to months
      const validityMapping = {
        '1 month': 1,
        '2 months': 2,
        '3 months': 3,
        '6 months': 6,
        '9 months': 9,
        '1 year': 12,
        '2 years': 24,
        '3 years': 36,
        '4 years': 48,
        '5 years': 60,
      };

      const monthsToAdd = validityMapping[basket.validity];
      if (monthsToAdd === undefined) {
        return res.status(400).json({ status: false, message: 'Invalid plan validity period' });
      }

      const start = new Date();
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);  // Set end date to the end of the day
      end.setMonth(start.getMonth() + monthsToAdd);  // Add the plan validity duration



      const settings = await BasicSetting_Modal.findOne();
      let total = basket.basket_price; // Use let for reassignable variables
      let totalgst = 0;
      
      if (settings.gst > 0 && settings.gststatus==1) {
        totalgst = (basket.basket_price * settings.gst) / 100; // Use settings.gst instead of gst
        total = basket.basket_price + totalgst;
      }
      
     

      // Create a new subscription
      const newSubscription = new BasketSubscription_Modal({
        basket_id,
        client_id,
        total: total,
        plan_price: basket.basket_price,
        gstamount:totalgst,
        gst: settings.gst,
        startdate: start,
        enddate: end,
        validity: basket.validity,
      });



      // Save to the database
      const savedSubscription = await newSubscription.save();




        // const length = 6;
        // const digits = '0123456789';
        // let orderNumber = '';

        // for (let i = 0; i < length; i++) {
        //   orderNumber += digits.charAt(Math.floor(Math.random() * digits.length));
        // }

        const invoicePrefix = settings.invoice;
        const invoiceStart = settings.invoicestart; 
        const basketCount = await BasketSubscription_Modal.countDocuments({});
        const planCount = await PlanSubscription_Modal.countDocuments({});
        const totalCount = basketCount + planCount;
        const invoiceNumber = invoiceStart + totalCount;
        const formattedNumber = invoiceNumber < 10 ? `0${invoiceNumber}` : `${invoiceNumber}`;
        const orderNumber = `${invoicePrefix}${formattedNumber}`;




        let payment_type;
          payment_type = "Offline";

        

        const templatePath = path.join(__dirname, '../../template', 'invoice.html');
        let htmlContent = fs.readFileSync(templatePath, 'utf8');


        let sgst = 0, cgst = 0, igst = 0, pergstsc = 0, pergstt = 0;

        if (client.state.toLowerCase() === settings.state.toLowerCase() || client.state.toLowerCase() ==="") {
            sgst = totalgst / 2;
            cgst = totalgst / 2;
            pergstsc = settings.gst/ 2;
          } else {
              igst = totalgst;
              pergstt = settings.gst;
          }
        const logo = `https://${req.headers.host}/uploads/basicsetting/${settings.logo}`;
        const simage = `https://${req.headers.host}/uploads/basicsetting/${settings.simage}`;

        let clientstateid;
        let settingsstateid;
        if(client.state) {
        const clientstate = await States.findOne({name:client.state});
        
         clientstateid = clientstate.id;
        }
        
        if(settings.state) {
          const settingsstate = await States.findOne({name:settings.state});
          
          settingsstateid = settingsstate.id;
          }


        htmlContent = htmlContent
          .replace(/{{orderNumber}}/g, `${orderNumber}`)
          .replace(/{{created_at}}/g, formatDate(savedSubscription.created_at))
          .replace(/{{payment_type}}/g, payment_type)
          .replace(/{{clientname}}/g, client.FullName)
          .replace(/{{email}}/g, client.Email)
          .replace(/{{PhoneNo}}/g, client.PhoneNo)
          .replace(/{{validity}}/g, savedSubscription.validity)
          .replace(/{{plan_end}}/g, formatDate(savedSubscription.enddate))
          .replace(/{{plan_price}}/g, savedSubscription.plan_price)
          .replace(/{{total}}/g, savedSubscription.total)
          .replace(/{{discount}}/g, savedSubscription.discount)
          .replace(/{{orderid}}/g, savedSubscription.orderid)
          .replace(/{{planname}}/g, basket.title)
          .replace(/{{plantype}}/g, "Basket")
          .replace(/{{company_email}}/g, settings.email_address)
          .replace(/{{company_phone}}/g, settings.contact_number)
          .replace(/{{company_address}}/g, settings.address)
          .replace(/{{company_website_title}}/g, settings.website_title)
          .replace(/{{invoicetnc}}/g, settings.invoicetnc)
          .replace(/{{gstin}}/g, settings.gstin)
          .replace(/{{gstamount}}/g, totalgst)
          .replace(/{{state}}/g, client.state)
          .replace(/{{gst}}/g, settings.gst)
          .replace(/{{sgst}}/g, sgst.toFixed(2))
          .replace(/{{cgst}}/g, cgst.toFixed(2))
          .replace(/{{igst}}/g, igst.toFixed(2))
          .replace(/{{logo}}/g, logo)
          .replace(/{{simage}}/g, simage)
          .replace(/{{pergstsc}}/g, pergstsc)
          .replace(/{{pergstt}}/g, pergstt)
          .replace(/{{saccode}}/g, settings.saccode)
          .replace(/{{bstate}}/g, settings.state)
          .replace(/{{panno}}/g, client.panno ?? 'NA')
          .replace(/{{city}}/g, client.city)
          .replace(/{{statecode}}/g, clientstateid)
          .replace(/{{settingstatecode}}/g, settingsstateid)
          .replace(/{{totalworld}}/g, convertAmountToWords(savedSubscription.total))
          .replace(/{{plan_start}}/g, formatDate(savedSubscription.startdate));


        const browser = await puppeteer.launch({
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setContent(htmlContent);

        // Define the path to save the PDF
        const pdfDir = path.join(__dirname, `../../../${process.env.DOMAIN}/uploads`, 'invoice');
        const pdfPath = path.join(pdfDir, `${orderNumber}.pdf`);

        // Generate PDF and save to the specified path
        await page.pdf({
          path: pdfPath,
          format: 'A4',
          printBackground: true,
          margin: {
            top: '20mm',
            right: '10mm',
            bottom: '50mm',
            left: '10mm',
          },
        });

        await browser.close();

        savedSubscription.ordernumber = `${orderNumber}`;
        savedSubscription.invoice = `${orderNumber}.pdf`;
        const updatedSubscription = await savedSubscription.save();

        if (settings.invoicestatus == 1) {

        const mailtemplate = await Mailtemplate_Modal.findOne({ mail_type: 'invoice' }); // Use findOne if you expect a single document
        if (!mailtemplate || !mailtemplate.mail_body) {
          throw new Error('Mail template not found');
        }



        const templatePaths = path.join(__dirname, '../../template', 'mailtemplate.html');

        fs.readFile(templatePaths, 'utf8', async (err, htmlTemplate) => {
          if (err) {
            // console.error('Error reading HTML template:', err);
            return;
          }

          let finalMailBody = mailtemplate.mail_body
            .replace('{clientName}', `${client.FullName}`);

          const logo = `https://${req.headers.host}/uploads/basicsetting/${settings.logo}`;

          // Replace placeholders with actual values
          const finalHtml = htmlTemplate
            .replace(/{{company_name}}/g, settings.website_title)
            .replace(/{{body}}/g, finalMailBody)
            .replace(/{{logo}}/g, logo);

          const mailOptions = {
            to: client.Email,
            from: `${settings.from_name} <${settings.from_mail}>`,
            subject: `${mailtemplate.mail_subject}`,
            html: finalHtml,
            attachments: [
              {
                filename: `${orderNumber}.pdf`, // PDF file name
                path: pdfPath, // Path to the PDF file
              }
            ]
          };

          // Send email
          await sendEmail(mailOptions);
        });

      }


      // Respond with the created subscription
      return res.status(201).json({
        status: true,
        message: 'Subscription added successfully',
        data: savedSubscription
      });

    } catch (error) {
      // console.log(error);
      return res.status(500).json({ status: false, message: 'Server error', data: [] });
    }
  }



  async addBasketSubscriptionWithPlan(req, res) {
    try {
      const { basket_id, client_id, price } = req.body;

      // Validate input
      if (!basket_id || !client_id) {
        return res.status(400).json({ status: false, message: 'Missing required fields' });
      }


      const client = await Clients_Modal.findOne({ _id: client_id, del: 0, ActiveStatus: 1 });
      if (!client) {
        return res.status(400).json({ status: false, message: 'Client Not Actived' });
      }


      const basket = await Basket_Modal.findOne({
        _id: basket_id,
        del: false
      });



      // Map plan validity to months
      const validityMapping = {
        '1 month': 1,
        '2 months': 2,
        '3 months': 3,
        '6 months': 6,
        '9 months': 9,
        '1 year': 12,
        '2 years': 24,
        '3 years': 36,
        '4 years': 48,
        '5 years': 60,
      };

      const monthsToAdd = validityMapping[basket.validity];
      if (monthsToAdd === undefined) {
        return res.status(400).json({ status: false, message: 'Invalid plan validity period' });
      }

      const start = new Date();
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);  // Set end date to the end of the day
      end.setMonth(start.getMonth() + monthsToAdd);  // Add the plan validity duration




      const settings = await BasicSetting_Modal.findOne();
      let total = basket.basket_price; // Use let for reassignable variables
      let totalgst = 0;
      
      if (settings.gst > 0 && settings.gststatus==1) {
        totalgst = (basket.basket_price * settings.gst) / 100; // Use settings.gst instead of gst
        total = basket.basket_price + totalgst;
      }
      

      // Create a new subscription
      const newSubscription = new BasketSubscription_Modal({
        basket_id,
        client_id,
        total: total,
        plan_price: basket.basket_price,
        gstamount:totalgst,
        gst: settings.gst,
        startdate: start,
        enddate: end,
        validity: basket.validity,
      });



      // Save to the database
      const savedSubscription = await newSubscription.save();




      // const length = 6;
      // const digits = '0123456789';
      // let orderNumber = '';

      // for (let i = 0; i < length; i++) {
      //   orderNumber += digits.charAt(Math.floor(Math.random() * digits.length));
      // }


      const invoicePrefix = settings.invoice;
      const invoiceStart = settings.invoicestart; 
      const { startDate, endDate } = getFinancialYearRange();

      const basketCount = await BasketSubscription_Modal.countDocuments({
          created_at: { $gte: startDate, $lte: endDate }
      });
      
      const planCount = await PlanSubscription_Modal.countDocuments({
          created_at: { $gte: startDate, $lte: endDate }
      });
      const totalCount = basketCount + planCount;
      const invoiceNumber = invoiceStart + totalCount;
      const formattedNumber = invoiceNumber < 10 ? `0${invoiceNumber}` : `${invoiceNumber}`;
      const financialYear = getFinancialYear();
      const orderNumber = `${invoicePrefix}${financialYear}-${formattedNumber}`;
      // const orderNumber = `${invoicePrefix}${formattedNumber}`;


      let payment_type;
        payment_type = "Offline";

      

      const templatePath = path.join(__dirname, '../../template', 'invoice.html');
      let htmlContent = fs.readFileSync(templatePath, 'utf8');

      let sgst = 0, cgst = 0, igst = 0;

      if (client.state.toLowerCase() === settings.state.toLowerCase() || client.state.toLowerCase() ==="") {
          sgst = totalgst / 2;
          cgst = totalgst / 2;
      } else {
          igst = totalgst;
      }
      const logo = `https://${req.headers.host}/uploads/basicsetting/${settings.logo}`;
      const simage = `https://${req.headers.host}/uploads/basicsetting/${settings.simage}`;



      htmlContent = htmlContent
        .replace(/{{orderNumber}}/g, `${orderNumber}`)
        .replace(/{{created_at}}/g, formatDate(savedSubscription.created_at))
        .replace(/{{payment_type}}/g, payment_type)
        .replace(/{{clientname}}/g, client.FullName)
        .replace(/{{email}}/g, client.Email)
        .replace(/{{PhoneNo}}/g, client.PhoneNo)
        .replace(/{{validity}}/g, savedSubscription.validity)
        .replace(/{{plan_end}}/g, formatDate(savedSubscription.enddate))
        .replace(/{{plan_price}}/g, savedSubscription.plan_price)
        .replace(/{{total}}/g, savedSubscription.total)
        .replace(/{{discount}}/g, savedSubscription.discount)
        .replace(/{{orderid}}/g, savedSubscription.orderid)
        .replace(/{{planname}}/g, basket.title)
        .replace(/{{plantype}}/g, "Basket")
        .replace(/{{company_email}}/g, settings.email_address)
        .replace(/{{company_phone}}/g, settings.contact_number)
        .replace(/{{company_address}}/g, settings.address)
        .replace(/{{company_website_title}}/g, settings.website_title)
        .replace(/{{invoicetnc}}/g, settings.invoicetnc)
        .replace(/{{gstin}}/g, settings.gstin)
        .replace(/{{gstamount}}/g, totalgst)
        .replace(/{{state}}/g, client.state)
        .replace(/{{gst}}/g, settings.gst)
        .replace(/{{sgst}}/g, sgst.toFixed(2))
        .replace(/{{cgst}}/g, cgst.toFixed(2))
        .replace(/{{igst}}/g, igst.toFixed(2))
        .replace(/{{logo}}/g, logo)
        .replace(/{{simage}}/g, simage)
        .replace(/{{plan_start}}/g, formatDate(savedSubscription.startdate));


      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();
      await page.setContent(htmlContent);

      // Define the path to save the PDF
      const pdfDir = path.join(__dirname, `../../../${process.env.DOMAIN}/uploads`, 'invoice');
      const pdfPath = path.join(pdfDir, `${orderNumber}.pdf`);

      // Generate PDF and save to the specified path
      await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '10mm',
          bottom: '50mm',
          left: '10mm',
        },
      });

      await browser.close();

      savedSubscription.ordernumber = `${orderNumber}`;
      savedSubscription.invoice = `${orderNumber}.pdf`;
      const updatedSubscription = await savedSubscription.save();

      if (settings.invoicestatus == 1) {

      const mailtemplate = await Mailtemplate_Modal.findOne({ mail_type: 'invoice' }); // Use findOne if you expect a single document
      if (!mailtemplate || !mailtemplate.mail_body) {
        throw new Error('Mail template not found');
      }



      const templatePaths = path.join(__dirname, '../../template', 'mailtemplate.html');

      fs.readFile(templatePaths, 'utf8', async (err, htmlTemplate) => {
        if (err) {
          // console.error('Error reading HTML template:', err);
          return;
        }

        let finalMailBody = mailtemplate.mail_body
          .replace('{clientName}', `${client.FullName}`);

        const logo = `https://${req.headers.host}/uploads/basicsetting/${settings.logo}`;

        // Replace placeholders with actual values
        const finalHtml = htmlTemplate
          .replace(/{{company_name}}/g, settings.website_title)
          .replace(/{{body}}/g, finalMailBody)
          .replace(/{{logo}}/g, logo);

        const mailOptions = {
          to: client.Email,
          from: `${settings.from_name} <${settings.from_mail}>`,
          subject: `${mailtemplate.mail_subject}`,
          html: finalHtml,
          attachments: [
            {
              filename: `${orderNumber}.pdf`, // PDF file name
              path: pdfPath, // Path to the PDF file
            }
          ]
        };

        // Send email
        await sendEmail(mailOptions);
      });

    }


      // Respond with the created subscription
      return res.status(201).json({
        status: true,
        message: 'Subscription added successfully',
        data: savedSubscription
      });

    } catch (error) {
      // console.log(error);
      return res.status(500).json({ status: false, message: 'Server error', data: [] });
    }
  }




  async BasketSubscriptionList(req, res) {
    try {
      const { fromDate, toDate, search, page = 1 } = req.body; // Extract filters and pagination details
      const limit = 10;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Match conditions for date range
      const matchConditions = { del: false };

      if (fromDate && toDate) {
        const startOfFromDate = new Date(fromDate);
        startOfFromDate.setHours(0, 0, 0, 0);

        const endOfToDate = new Date(toDate);
        endOfToDate.setHours(23, 59, 59, 999);

        matchConditions.created_at = {
          $gte: startOfFromDate,
          $lte: endOfToDate,
        };
      }

      // Match conditions for search
      const searchMatch = search && search.trim() !== "" ? {
        $or: [
          { "clientDetails.FullName": { $regex: search, $options: "i" } }, // Search by client name
          { "clientDetails.Email": { $regex: search, $options: "i" } },    // Search by client email
          { "clientDetails.PhoneNo": { $regex: search, $options: "i" } },  // Search by client mobile
          { "basketDetails.title": { $regex: search, $options: "i" } }      // Search by basket name
        ]
      } : {};

      // Main aggregation pipeline
      const result = await BasketSubscription_Modal.aggregate([
        { $match: matchConditions },
        {
          $lookup: {
            from: 'baskets', // The name of the baskets collection
            localField: 'basket_id', // Field in BasketSubscription_Modal referencing baskets
            foreignField: '_id', // Field in baskets collection
            as: 'basketDetails' // Joined data field
          }
        },
        {
          $unwind: '$basketDetails' // Unwind the result if there is only one basket per subscription
        },
        {
          $lookup: {
            from: 'clients', // The name of the clients collection
            localField: 'client_id', // Field in BasketSubscription_Modal referencing clients
            foreignField: '_id', // Field in clients collection
            as: 'clientDetails' // Joined data field
          }
        },
        {
          $unwind: '$clientDetails' // Unwind the result if there is only one client per subscription
        },
        { $match: searchMatch }, // Apply search filter
        {
          $project: {
            orderid: 1,
            created_at: 1,
            startdate: 1,
            enddate: 1,
            plan_price: 1,
            total: 1,
            discount: 1,
            coupon: 1,
            validity: 1,
            gstamount: 1,
            gst: 1,
            status: 1,
            basketDetails: 1,
            invoice: 1,
            clientName: '$clientDetails.FullName',
            clientEmail: '$clientDetails.Email',
            clientPhoneNo: '$clientDetails.PhoneNo',
            totalAmount: 1, // Add other fields specific to subscriptions
          }
        },
        { $sort: { created_at: -1 } }, // Sort by creation date (newest first)
        { $skip: skip }, // Pagination: Skip 'skip' items
        { $limit: parseInt(limit) } // Limit to 'limit' items
      ]);

      // Total records for pagination
      const totalRecordsPipeline = [
        { $match: matchConditions },
        {
          $lookup: {
            from: 'clients',
            localField: 'client_id',
            foreignField: '_id',
            as: 'clientDetails'
          }
        },
        { $unwind: '$clientDetails' },
        { $match: searchMatch },
        { $count: 'total' }
      ];
      const totalRecordsResult = await BasketSubscription_Modal.aggregate(totalRecordsPipeline);
      const totalRecords = totalRecordsResult[0] ? totalRecordsResult[0].total : 0;
      const totalPages = Math.ceil(totalRecords / limit);

      // Respond with results and pagination
      return res.json({
        status: true,
        message: "Basket Subscriptions retrieved successfully",
        data: result,
        pagination: {
          total: totalRecords,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages
        }
      });

    } catch (error) {
      // console.error(error);
      return res.status(500).json({ status: false, message: 'Server error', data: [] });
    }
  }


  async BasketSubscriptionListWithId(req, res) {
    try {
      const { fromDate, toDate, search, basket_id, page = 1 } = req.body; // Extract filters, including basket_id
      const limit = 10;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Match conditions for date range
      const matchConditions = { del: false };

      if (basket_id) {
        matchConditions.basket_id = new mongoose.Types.ObjectId(basket_id);; // Filter by basket_id
      }

      if (fromDate && toDate) {
        const startOfFromDate = new Date(fromDate);
        startOfFromDate.setHours(0, 0, 0, 0);

        const endOfToDate = new Date(toDate);
        endOfToDate.setHours(23, 59, 59, 999);

        matchConditions.created_at = {
          $gte: startOfFromDate,
          $lte: endOfToDate,
        };
      }

      // Match conditions for search
      const searchMatch = search && search.trim() !== "" ? {
        $or: [
          { "clientDetails.FullName": { $regex: search, $options: "i" } },
          { "clientDetails.Email": { $regex: search, $options: "i" } },
          { "clientDetails.PhoneNo": { $regex: search, $options: "i" } },
          { "basketDetails.title": { $regex: search, $options: "i" } }
        ]
      } : {};

      // Main aggregation pipeline
      const result = await BasketSubscription_Modal.aggregate([
        { $match: matchConditions },
        {
          $lookup: {
            from: 'baskets',
            localField: 'basket_id',
            foreignField: '_id',
            as: 'basketDetails'
          }
        },
        { $unwind: '$basketDetails' },
        {
          $lookup: {
            from: 'clients',
            localField: 'client_id',
            foreignField: '_id',
            as: 'clientDetails'
          }
        },
        { $unwind: '$clientDetails' },
        { $match: searchMatch },
        {
          $project: {
            orderid: 1,
            created_at: 1,
            startdate: 1,
            enddate: 1,
            plan_price: 1,
            total: 1,
            discount: 1,
            coupon: 1,
            validity: 1,
            status: 1,
            basketDetails: 1,
            invoice: 1,
            clientName: '$clientDetails.FullName',
            clientEmail: '$clientDetails.Email',
            clientPhoneNo: '$clientDetails.PhoneNo',
            totalAmount: 1,
          }
        },
        { $sort: { created_at: -1 } },
        { $skip: skip },
        { $limit: parseInt(limit) }
      ]);

      // Total records for pagination
      const totalRecordsPipeline = [
        { $match: matchConditions },
        {
          $lookup: {
            from: 'clients',
            localField: 'client_id',
            foreignField: '_id',
            as: 'clientDetails'
          }
        },
        { $unwind: '$clientDetails' },
        { $match: searchMatch },
        { $count: 'total' }
      ];
      const totalRecordsResult = await BasketSubscription_Modal.aggregate(totalRecordsPipeline);
      const totalRecords = totalRecordsResult[0] ? totalRecordsResult[0].total : 0;
      const totalPages = Math.ceil(totalRecords / limit);

      // Respond with results and pagination
      return res.json({
        status: true,
        message: "Basket Subscriptions retrieved successfully",
        data: result,
        pagination: {
          total: totalRecords,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages
        }
      });

    } catch (error) {
      // console.error(error);
      return res.status(500).json({ status: false, message: 'Server error', data: [] });
    }
  }

  async activeBasketListByClient(req, res) {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.json({
          status: false,
          message: "Client ID is required",
          data: []
        });
      }
  
      // Step 1: Fetch all baskets (active only)
      const baskets = await Basket_Modal.find({ del: false, publishstatus: true }).sort({ created_at: -1 });
  
      // Step 2: Fetch subscriptions of that client
      const subscriptions = await BasketSubscription_Modal.find({ client_id: id, del: false });
  
      // Step 3: Map subscription data for easy lookup
      const now = new Date();
      const basketStatusMap = {};
      subscriptions.forEach(sub => {
        const basketIdStr = sub.basket_id?.toString();
        if (!basketIdStr) return;
  
        const isValid = sub.status === 'active' && new Date(sub.startdate) <= now && new Date(sub.enddate) >= now;
  
        basketStatusMap[basketIdStr] = isValid ? 'active' : 'expired';
      });
      // Step 4: Attach basket subscription status
      const basketsWithStatus = baskets.map(basket => {
        const basketIdStr = basket._id.toString();
        return {
          ...basket._doc,
          client_status: basketStatusMap[basketIdStr] || "NA"
        };
      });
  
      return res.json({
        status: true,
        message: "Baskets fetched successfully",
        data: basketsWithStatus
      });
  
    } catch (error) {
      console.error("Error in activeBasket:", error);
      return res.json({
        status: false,
        message: "Server error",
        data: []
      });
    }
  }



}

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  return `${day}/${month}/${year}`;

}

function convertAmountToWords(amount) {
  const [whole, fraction] = amount.toString().split('.');

  let words = toWords(parseInt(whole));
  words = words.charAt(0).toUpperCase() + words.slice(1);

  if (fraction && parseInt(fraction) > 0) {
    words += ` and ${toWords(parseInt(fraction))} paise`;
  }

  return words;
}

function getFinancialYearRange() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const startYear = month >= 4 ? year : year - 1;
  const endYear = startYear + 1;

  const startDate = new Date(`${startYear}-04-01T00:00:00.000Z`);
  const endDate = new Date(`${endYear}-03-31T23:59:59.999Z`);

  return { startDate, endDate };
}

function getFinancialYear() {
  const now = new Date();
  const month = now.getMonth() + 1; // getMonth() returns 0–11
  const year = now.getFullYear();

  let startYear, endYear;

  if (month >= 4) {
      // April or later: FY starts this year
      startYear = year;
      endYear = year + 1;
  } else {
      // Jan–March: FY started last year
      startYear = year - 1;
      endYear = year;
  }

  // Return in format 24-25
  return `${startYear.toString().slice(-2)}-${endYear.toString().slice(-2)}`;
}

module.exports = new Basket();