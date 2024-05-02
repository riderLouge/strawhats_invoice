const express = require("express");
const prisma = require("./prisma/prismaClient");
const nodemailer = require('nodemailer');
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

function generateOtp() {
  const length = 6; // Length of OTP
  const digits = '0123456789'; // Possible digits for OTP

  let OTP = '';
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }

  return OTP;
}

function sendOtpEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
      user: 'dhanushprofo@gmail.com',
      pass: 'shtq wpgf dirf qhjp'
    }
  });

  const mailOptions = {
    from: 'dhanush@gmail.com',
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP for password reset is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;
  console.log('in', req.body)
  // Check if the email exists in the database
  const user = await prisma.loginAuth.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Generate a random OTP
  const otp = generateOtp(); // Implement this function

  // Store the OTP in the database
  await prisma.loginAuth.update({
    where: { Id: user.Id },
    data: {
      passwordResetOTP: otp,
      passwordResetExpiresAt: new Date(Date.now() + 120000), // OTP expires in 2 minutes
    },
  });

  // Send the OTP to the user's email
  sendOtpEmail(email, otp); // Implement this function

  res.status(200).json({ status: 'success', message: 'OTP sent successfully' });
});

// Route for resetting password
app.post('/api/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  // Find the user by email
  const user = await prisma.loginAuth.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Check if OTP matches and is not expired
  if (user.passwordResetOTP !== otp || user.passwordResetExpiresAt < new Date()) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  // Update the user's password
  await prisma.loginAuth.update({
    where: { Id: user.Id },
    data: {
      password: newPassword,
      passwordResetOTP: null,
      passwordResetExpiresAt: null,
    },
  });

  res.status(200).json({ status: 'success', message: 'Password reset successful' });
});

app.get("/api/company/fetchCompany", async (req, res) => {
  try {
    const companies = await prisma.company.findMany();
    res.json(companies);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the companies" });
  }
});


app.post("/api/items/add", async (req, res) => {
  try {
    const newItem = req.body;
    const createdItem = await prisma.product.create({
      data: newItem,
    });
    res.json(createdItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while adding the item" });
  }
});

app.post("/api/shop/add", async (req, res) => {
  try {
    const newItem = req.body;
    const createdItem = await prisma.shop.create({
      data: newItem,
    });
    res.json(createdItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while adding the shop" });
  }
});

//fetch staff details
app.get("/api/staff/staffDetails", async (req, res) => {
  try {
    const staffs = await prisma.staff.findMany();
    res.status(200).json({ success: 'staff data fetched successfully', data: staffs });
  } catch (error) {
    console.error("Error fetching staffs:", error);
    res.status(500).json({ error: "An error occurred while fetching the staffs" });
  }
});

// create a new staff
app.post("/api/staff/add", async (req, res) => {
  try {
    const newItem = req.body;

    // Check if email already exists
    const existingStaff = await prisma.staff.findUnique({
      where: {
        email: newItem.email,
      },
    });

    if (existingStaff) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create new staff member
    const createdItem = await prisma.staff.create({
      data: newItem,
    });

    // Send success status to the frontend
    return res.status(201).json({ success: "Staff member added successfully", data: createdItem });
  } catch (error) {
    console.error("Error adding staff:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// edit the staff details
app.put("/api/staff/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItemData = req.body;
    const updatedItem = await prisma.staff.update({
      where: { userid: parseInt(id) },
      data: updatedItemData,
    });
    res.status(200).json({ status: 'staff edited successfully', data: updatedItem });
  } catch (error) {
    console.error("Error editing item:", error);
    res.status(500).json("An error occurred while editing the staff details", error);
  }
});
app.put("/api/items/edit/:id", async (req, res) => {
  try {
    const { id } = req.params.id;
    const updatedItemData = req.body;
    const updatedItem = await prisma.product.update({
      where: { ID: id },
      data: updatedItemData,
    });
    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while editing the item" });
  }
});

app.get("/api/products/fetchItems", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the products" });
  }
});

app.get("/api/user/fetchUsers", async (req, res) => {
  try {
    const users = await prisma.loginAuth.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the users" });
  }
});

app.get("/api/shops/fetchItems", async (req, res) => {
  try {
    const shops = await prisma.shop.findMany();
    res.json(shops);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the companies" });
  }
});

app.post("/api/items/insert", async (req, res) => {
  try {
    const modifiedData = req.body;
    for (const data of modifiedData) {
      await prisma.product.create({
        data: {
          CNAME: data.CNAME ? data.CNAME.toString() : "",
          NAME: data.NAME ? data.NAME.toString() : "",
          MRP: data.MRP ? data.MRP.toString() : "",
          PPRICE: data.PPRICE ? data.PPRICE.toString() : "",
          SPRICE: data.SPRICE ? data.SPRICE.toString() : "",
          GST: data.GST ? data.GST.toString() : "",
          HSN: data.HSN ? data.HSN.toString() : "",
          CESSP: data.CESSP ? data.CESSP.toString() : "",
          FITEC: data.FITEC ? data.FITEC.toString() : "",
          FQTY: data.FQTY ? data.FQTY.toString() : "",
          FREE: data.FREE ? data.FREE.toString() : "",
          DISCP: data.DISCP ? data.DISCP.toString() : "",
          CMCODE: data.CMCODE ? data.CMCODE.toString() : "",
        },
      });
    }

    res.status(201).json({ message: "Data inserted successfully" });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ error: "An error occurred while inserting data" });
  }
});

app.post("/api/shops/insert", async (req, res) => {
  try {
    const modifiedData = req.body;
    for (const data of modifiedData) {
      await prisma.shop.create({
        data: {
          GRPNAM: data.GRPNAM ? data.GRPNAM.toString() : "",
          CUSNAM: data.CUSNAM ? data.CUSNAM.toString() : "",
          ADRONE: data.ADRONE ? data.ADRONE.toString() : "",
          ADRTWO: data.ADRTWO ? data.ADRTWO.toString() : "",
          ADRTHR: data.ADRTHR ? data.ADRTHR.toString() : "",
          ADRFOU: data.ADRFOU ? data.ADRFOU.toString() : "",
          PLC: data.PLC ? data.PLC.toString() : "",
          PINCOD: data.PINCOD ? data.PINCOD.toString() : "",
          CNTPER: data.CNTPER ? data.CNTPER.toString() : "",
          SLNO: data.SLNO ? data.SLNO.toString() : "",
          TNGST: data.TNGST ? data.TNGST.toString() : "",
          TELNUM: data.TELNUM ? data.TELNUM.toString() : "",
          ZONNAM: data.ZONNAM ? data.ZONNAM.toString() : "",
        },
      });
    }

    res.status(201).json({ message: "Data inserted successfully" });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ error: "An error occurred while inserting data" });
  }
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
