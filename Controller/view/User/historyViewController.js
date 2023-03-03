/* eslint-disable camelcase */
const catchAsync = require('../../../utils/catchAsync');
const historyController = require('../../User/historyController');

exports.renderHistoryPage = catchAsync(async (req, res) => {
  const [items, totalPage] = await Promise.all([
    historyController.getItems(req.user._id, {
      page: 0,
      limit: 8,
      sort: '-ts',
      skip: 0,
    }),
    historyController.getTotalPage(),
  ]);

  res.render('pages/history/page', {
    page: 'history',
    userData: req.restrictUserData,

    userRecordHistory:req.user.recordHistory,

    items,
    query: {
      totalPage,
      limit: 8,
      skip: 8,
      maxSkip: 50,
      docsLeft: true,
    },
  });
});
