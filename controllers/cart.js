const client = require("../config/db");
const connection = client.collection("cart");
const courses = client.collection("courses");

const catchError = require("../utilities/catchError");
const throwError = require("../utilities/throwError");
const { ensureObject } = require("../utilities/helper");
const { ObjectId } = require("mongodb");

exports.addCart = catchError(async (req, resp, next) => {
  let rslt;
  const requestData = ensureObject(req.body);
  const { course_id, quantity } = requestData;

  if (!course_id || !ObjectId.isValid(course_id))
    return next(new throwError("invalid course id", 400));

  if (Number(quantity) <= 0 || isNaN(Number(quantity)))
    return next(new throwError("Invalid quantity", 400));

  const course = await courses.findOne({ _id: new ObjectId(course_id) });

  if (!course) return next(new throwError("invalid course id", 400));

  if (course.spaces < Number(quantity))
    return next(
      new throwError(
        `only ${course.spaces} ${course.subject} course are available`,
        400
      )
    );

  const existingCartItem = await connection.findOne({
    course_id: requestData.course_id,
  });

  if (existingCartItem) {
    rslt = await connection.updateOne(
      { course_id: requestData.course_id },
      { $inc: { quantity: quantity } }
    );
  } else {
    rslt = !Array.isArray(requestData)
      ? await connection.insertOne(requestData)
      : await connection.insertMany(requestData);
  }

  await courses.updateOne(
    { _id: new ObjectId(course_id) },
    { $inc: { spaces: -quantity } }
  );

  resp.status(201).json({
    success: true,
    message: "course added to cart successfully",
  });
});

exports.getCarts = catchError(async (req, resp, next) => {
  let cartItems = await connection.find().toArray();

  if (!cartItems.length)
    return resp.status(200).json({
      success: true,
      message: "No items in cart",
      count: 0,
      data: [],
    });

  // Fetch courses corresponding to the cart items
  const courseIds = cartItems.map((item) => new ObjectId(item.course_id));
  const courseDetails = await courses
    .find({ _id: { $in: courseIds } })
    .toArray();

  const enrichedCart = cartItems.map((item) => {
    const course = courseDetails.find(
      (course) => course._id.toString() === item.course_id
    );

    const total = item.quantity * course.price;

    return {
      ...item,
      total,
      course,
    };
  });

  const totalCartValue = enrichedCart.reduce(
    (acc, item) => acc + item.total,
    0
  );

  resp.status(200).json({
    success: true,
    message: "Cart items fetched successfully",
    count: enrichedCart.length,
    totalCartValue,
    data: enrichedCart,
  });
});

exports.getCart = catchError(async (req, resp, next) => {
  const { id } = ensureObject(req.params);
  let cartItems = await connection.find({ course_id: id }).toArray();

  if (!cartItems.length)
    return next(new throwError("cart item not found", 404));

  // Fetch courses corresponding to the cart item
  const courseDetails = await courses.find({ _id: new ObjectId(id) }).toArray();

  const enrichedCart = cartItems.map((item) => {
    const course = courseDetails.find(
      (course) => course._id.toString() === item.course_id
    );

    const total = item.quantity * course.price;

    return {
      ...item,
      total,
      course,
    };
  });

  resp.status(200).json({
    success: true,
    message: "cart item fetched successfully",
    data: enrichedCart[0],
  });
});

exports.deleteCart = catchError(async (req, resp, next) => {
  const { id } = ensureObject(req.params);

  if (id && !ObjectId.isValid(id))
    return next(new throwError("invalid course ID", 400));

  const result = id
    ? await connection.deleteOne({ course_id: id })
    : await connection.deleteMany();

  if (!result?.deletedCount) {
    const message = id ? "cart item not found" : "no items in cart to delete";
    return next(new throwError(message, 404));
  }

  resp.status(200).json({
    success: true,
    message: `${id ? "cart item" : "all cart items"} deleted successfully`,
  });
});
