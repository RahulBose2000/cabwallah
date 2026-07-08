const userModel = require("../models/user.model");

module.exports.createUser = async ({ firstname, lastname, email, password }) => {
  // Validate that all required fields are provided
  if (!firstname || !email || !password) {
    throw new Error('Firstname, email, and password are required');
  }

  // Create a user object
  const userData = {
    fullname: {
      firstname,
      lastname
    },
    email,
    password
  };

  try {
    // Create a new user and wait for the operation to complete
    const user = await userModel.create(userData);

    // Return the created user
    return user;
  } catch (error) {
    // Handle errors that occur during user creation
    throw new Error('Error creating user: ' + error.message);
  }
};

