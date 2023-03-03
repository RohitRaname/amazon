const catchAsync = require('../../utils/catchAsync');
const send = require('../../utils/sendJSON');
const UserActivity = require('../../Model/user/userActivityModel');
const tryCatch = require('../../utils/tryCatch');
const topLevelBucketController = require('../userBucketController/topLevelList');


// with req func => apiReq
// without req func(direct func) => Func

// followUser & notUnfollowUser
exports.followUser = catchAsync(async (req, res, next) => {
  const followUserBody = req.body;

  await topLevelBucketController.addItemToList(
    UserActivity,
    req.user._id,
    'following',
    followUserBody,
    {
      checkItemExist: true,
      deleteItemExist: false,
    },
    {
      update: true,
      query: {
        filter: { 'following._id': { $ne: followUserBody._id } },

        update: {
          $push: {
            following: {
              $each: [followUserBody],
              $position: 0,
              $slice: 5,
            },
          },
        },
      },
    }
  );

  return send(res, 200, 'followed user');
});

exports.unFollowUser = catchAsync(async (req, res, next) => {
  const unfollowUserId = req.params.id;

  await topLevelBucketController.removeItemFromList(
    UserActivity,
    req.user._id,
    'following',
    unfollowUserId, // {_id:item._id}
    {
      update: true,
      query: {
        filter: {
          'following._id': unfollowUserId, //
        },
        update: {
            following: { $pull: { _id: unfollowUserId } },
        },
      },
    }
  );

  return send(res, 200, 'followed user');
});

exports.meFollowGivenUser = tryCatch(
  async (meId, userId) =>
    await topLevelBucketController.itemExistInList(
      UserActivity,
      meId,
      'following',
      userId
    )
);

// the user i am following
exports.getFollowingUsers = tryCatch(
  async (userId) =>
    await topLevelBucketController.getAllEmbeddedItems(UserActivity, userId, {
      listName: 'following',
      sort: null,
      project: null,
      directContainItems: true,
    })
);

exports.apiGetFollowingUsers= catchAsync(async(req,res,next)=>{
  const followingUsers= await this.getFollowingUsers(req.params.id)
  return send(res,200,"following-users",followingUsers)
})