db.createView("open_position", "ordermodels",
    [
      {
        $addFields: {
          tsprice: {
            $cond: {
              if: {
                $or: [
                  { $eq: ['$tsprice', 0] },
                  { $eq: ['$tsprice', "0"] },
                  { $eq: ['$tsprice', '0'] },
                ],
              },
              then: 0,
              else: { $add: [{ $toDouble: '$tsprice' }] },
            },
          },
          slprice: {
            $cond: {
              if: {
                $or: [
                  { $eq: ['$slprice', 0] },
                  { $eq: ['$slprice', "0"] },
                  { $eq: ['$slprice', '0'] },
                ],
              },
              then: 0,
              else: { $add: [{ $toDouble: '$slprice' }] },
            },
          },
        },
      },
      {
        $lookup: {
          from: 'basicsettings',
          let: {},
          pipeline: [],
          as: 'basics_settings',
        },
      },
      {
        $unwind: '$basics_settings',
      },
      {
        $match: {
          $and: [
            {
              $expr: {
                $and: [
                  { $eq: ['$basics_settings.brokerloginstatus', 1] },
                  { $in: ['$tsstatus', [1, 2]] },
                ],
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'stockliveprices',
          localField: 'ordertoken',
          foreignField: 'token',
          as: 'stockInfo',
        },
      },
      {
        $addFields: {
          stockInfo: {
            $ifNull: [{ $arrayElemAt: ['$stockInfo', 0] }, { curtime: 0, lp: 0 }],
          },
          stockInfo_lp: {
            $ifNull: [{ $toDouble: { $arrayElemAt: ['$stockInfo.lp', 0] } }, 0],
          },
          stockInfo_curtime: {
            $ifNull: [{ $arrayElemAt: ['$stockInfo.curtime', 0] }, 0],
          },
          isLpInRangeTarget: {
            $cond: {
              if: {
                $or: [
                  { $eq: ['$tsprice', 0] },
                  {
                    $eq: [
                      { $ifNull: [{ $toDouble: { $arrayElemAt: ['$stockInfo.lp', 0] } }, 0] },
                      0,
                    ],
                  },
                ],
              },
              then: false,
              else: {
                $gte: [
                  { $ifNull: [{ $toDouble: { $arrayElemAt: ['$stockInfo.lp', 0] } }, 0] },
                  '$tsprice',
                ],
              },
            },
          },
          isLpInRangeStoploss: {
            $cond: {
              if: {
                $or: [
                  { $eq: ['$slprice', 0] },
                  {
                    $eq: [
                      { $ifNull: [{ $toDouble: { $arrayElemAt: ['$stockInfo.lp', 0] } }, 0] },
                      0,
                    ],
                  },
                ],
              },
              then: false,
              else: {
                $lte: [
                  { $ifNull: [{ $toDouble: { $arrayElemAt: ['$stockInfo.lp', 0] } }, 0] },
                  '$slprice',
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          clientid: 1,
          signalid: 1,
          orderid: 1,
          ordertype: 1,
          borkerid: 1,
          quantity: 1,
          ordertoken: 1,
          tsprice: 1,
          slprice: 1,
          tsstatus: 1,
          exchange: 1,
          exitquantity: 1,
          stockInfo_curtime: 1,
          stockInfo_lp: 1,
          isLpInRangeTarget: 1,
          isLpInRangeStoploss: 1,
        },
      },
  
    ]
  )



  /// Open possition Excuted Trade
db.createView("open_position_excute", "open_position",
    [
      {
        $match: {
          $or: [
            { isLpInRangeTarget: true },
            { isLpInRangeStoploss: true },
           
          ]
        }
      }
    ]
  )
  
  