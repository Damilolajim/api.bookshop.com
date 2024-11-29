const { ObjectId } = require("mongodb");
const client = require("../config/db");
const connection = client.collection("courses");

const catchError = require("../utilities/catchError");
const throwError = require("../utilities/throwError");
const { ensureObject } = require("../utilities/helper");

exports.createCourse = catchError(async (req, resp, next) => {
  const requestData = ensureObject(req.body);
  const isDuplicateCourse = await connection.findOne({
    subject: requestData.subject,
  });

  if (isDuplicateCourse)
    return next(new throwError("course already exists", 403));

  const rslt = await connection.insertOne(requestData);

  if (!rslt.acknowledged) return next(new throwError("an error occured", 500));

  resp.status(201).json({
    success: true,
    message: "course added successfully",
    data: {
      course_id: rslt.insertedId,
    },
  });
});

exports.getCourses = catchError(async (req, resp, next) => {
  let query = {};
  let pagenation;
  const { id } = ensureObject(req.params);
  const queryParam = ensureObject(req.query);
  let { count, page, sort, order } = queryParam;

  if (id && !ObjectId.isValid(id))
    return next(new throwError("invalid course id", 400));

  // Remove pagination and sorting parameters from query
  if (queryParam) {
    ["page", "count", "sort", "order"].forEach((key) => delete queryParam[key]);

    query = { ...query, ...queryParam };
  }

  // Pagination defaults
  count = Number(count) || 100;
  page = Number(page) || 1;
  const skip = (page - 1) * count;

  // Sorting defaults
  sort = sort || "createdAt";
  order = order === "asc" || !order ? 1 : -1;

  const rslt = id
    ? await connection.findOne({ _id: new ObjectId(id) })
    : await connection
        .find(query)
        .sort({ [sort]: order })
        .skip(skip)
        .limit(count)
        .toArray();

  const rsltCount = rslt?.length;

  if (!rslt) return next(new throwError("course not found", 404));

  if (!id) {
    const totalCount = await connection.countDocuments(query);

    pagenation = {
      totalPages: Math.ceil(totalCount / count),
      currentPage: page,
      countPerPage: count,
      hasPreviousPage: page > 1,
      hasNextPage: page < Math.ceil(totalCount / count),
    };
  }

  resp.status(200).json({
    success: true,
    message: `${rsltCount ? "courses" : "course"} fetched successfully`,
    count: rsltCount ? rsltCount : undefined,
    data: rslt,
    pagenation,
  });
});

exports.updateCourse = catchError(async (req, resp, next) => {
  const { id } = ensureObject(req.params);
  const requestData = ensureObject(req.body);

  if (!id || !ObjectId.isValid(id))
    return next(new throwError("invalid course id", 403));

  if (requestData.subject) {
    const course = await connection.findOne({ subject: requestData.subject });

    if (course)
      return next(
        new throwError(
          `course (${requestData.subject}) already exiists, please choose a unique course name`,
          403
        )
      );
  }

  const rslt = await connection.updateOne(
    { _id: new ObjectId(id) },
    { $set: requestData }
  );

  if (!rslt?.modifiedCount)
    return next(new throwError("invalid course ID", 400));

  resp.status(200).json({
    success: true,
    message: "course updated successfully",
  });
});

exports.deleteCourse = catchError(async (req, resp, next) => {
  const { id } = ensureObject(req.params);

  if (!id && !ObjectId.isValid(id))
    return next(new throwError("invalid course id", 400));

  const rslt = await connection.deleteOne({ _id: new ObjectId(id) });

  if (!rslt?.deletedCount)
    return next(new throwError("invalid course ID", 400));

  resp.status(201).json({
    success: true,
    message: "course deleted successfully",
  });
});
