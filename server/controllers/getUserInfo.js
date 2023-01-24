const dbUser = require("../dbSChemas/user");

module.exports = (userId) => {
  return dbUser.aggregate([
    {
      $match: {
        _id: userId,
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: "$contacts",
      },
    },
    {
      $lookup: {
        from: "users",
        foreignField: "number",
        localField: "contacts.number",
        as: "contactInfo",
      },
    },
    {
      $project: {
        number: 1,
        profile: 1,
        about: 1,
        contacts: {
          name: 1,
          number: 1,
          messages: 1,
          about: { $arrayElemAt: ["$contactInfo.about", 0] },
          profile: {
            $arrayElemAt: ["$contactInfo.profile", 0],
          },
        },
      },
    },
    {
      $group: {
        _id: null,
        number: { $first: "$number" },
        profile: { $first: "$profile" },
        about: { $first: "$about" },
        contacts: {
          $push: "$contacts",
        },
      },
    },
    {
      $set: {
        contacts: {
          $cond: [{ $eq: ["$contacts", [{}]] }, [], "$contacts"],
        },
      },
    },
  ]);
};
