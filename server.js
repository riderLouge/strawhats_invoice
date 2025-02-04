const express = require("express");
const prisma = require("./prisma/prismaClient");
const nodemailer = require("nodemailer");
const app = express();
const cors = require("cors");
const { UserRoles } = require("@prisma/client");

app.use(express.json());
app.use(cors());
// Increase payload limit (e.g., 10MB)
app.use(express.json({ limit: "10mb" }));
app.use(
  express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 })
);

// Generation random OTP code for reset the user password
function generateOtp() {
  const length = 6;
  const digits = "0123456789";

  let OTP = "";
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }

  return OTP;
}

function generatedPassword(name, phoneNumber) {
  let splitedName = '';
  if (name.length > 4) {
    splitedName = name.substring(0, 4);
  } else {
    splitedName = name;
  }
  const splitedNumber = phoneNumber.substring(0, 4);
  return splitedName + splitedNumber;
}
// Send the forgot password OTP to the user Email
function sendOtpEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: "dhanushprofo@gmail.com",
      pass: "shtq wpgf dirf qhjp",
    },
  });

  const mailOptions = {
    from: "dhanush@gmail.com",
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;
  console.log("in", req.body);
  // Check if the email exists in the database
  const user = await prisma.loginAuth.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
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

  res.status(200).json({ status: "success", message: "OTP sent successfully" });
});

// Route for resetting password
app.post("/api/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  // Find the user by email
  const user = await prisma.loginAuth.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Check if OTP matches and is not expired
  if (
    user.passwordResetOTP !== otp ||
    user.passwordResetExpiresAt < new Date()
  ) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
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

  res
    .status(200)
    .json({ status: "success", message: "Password reset successful" });
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

app.get("/api/shops/debitcredit", async (req, res) => {
  try {
    const data = await prisma.creditDebit.findMany();
    res.json(data);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the companies" });
  }
});

app.post("/api/items/add", async (req, res) => {
  const { CNAME, NAME, MRP, PPRICE, SPRICE, GST, HSN, FQTY } = req.body;

  // Validate each field individually and return specific error messages
  if (!CNAME) {
    return res.status(400).json({ error: "company name is required" });
  }

  if (!NAME) {
    return res.status(400).json({ error: "Product name is required" });
  }
  if (!HSN) {
    return res.status(400).json({ error: "HSN is required" });
  }
  
  if (!MRP) {
    return res.status(400).json({ error: "MRP is required" });
  }
  if (!PPRICE) {
    return res.status(400).json({ error: "Purchase price is required" });
  }
  if (!SPRICE) {
    return res.status(400).json({ error: "Selling price is required" });
  }
  if (!GST) {
    return res.status(400).json({ error: "GST is required" });
  }
  if (!FQTY) {
    return res.status(400).json({ error: "Quantity is required" });
  }

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
  const {
    GRPNAM,
    CUSNAM,
    ADRONE,
    SLNO,
    TELNUM,
    CNTPER,
    PINCOD,
    ZONNAM,
  } = req.body;

  // Validate each field individually and return specific error messages
  if (!GRPNAM) {
    return res.status(400).json({ error: "Group name is required" });
  }
  if (!CUSNAM) {
    return res.status(400).json({ error: "Customer name is required" });
  }
  if (!ADRONE) {
    return res.status(400).json({ error: "Address one is required" });
  }
  if (!SLNO) {
    return res.status(400).json({ error: "SL no is required" });
  }
  if (!TELNUM) {
    return res.status(400).json({ error: "Phone number is required" });
  }
  if (!CNTPER) {
    return res.status(400).json({ error: "Contact person is required" });
  }
  if (!PINCOD) {
    return res.status(400).json({ error: "Pincode is required" });
  }
  if (!ZONNAM) {
    return res.status(400).json({ error: "Zone name is required" });
  }

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


app.put("/api/shop/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItemData = req.body;

    console.log("Request:", req, "Updated Data:", updatedItemData, id);

    const updatedItem = await prisma.shop.update({
      where: { shopId: parseInt(id) },
      data: updatedItemData,
    });

    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while editing the item" });
  }
});
//fetch staff details
app.get("/api/staff/staffDetails", async (req, res) => {
  try {
    const staffs = await prisma.staff.findMany();
    res
      .status(200)
      .json({ success: "staff data fetched successfully", data: staffs });
  } catch (error) {
    console.error("Error fetching staffs:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the staffs" });
  }
});

// create a new staff
app.post("/api/staff/add", async (req, res) => {
  try {
    const { email, name, joinDate, role, phoneNumber } = req.body;

    // Regular expression for validating an Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name === "") {
      return res.status(400).json({ error: "Name should not be empty" });
    }
    if (joinDate === null) {
      return res.status(400).json({ error: "Join Date should not be empty" });
    }
    if (email === "") {
      return res.status(400).json({ error: "Email should not be empty" });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    if (role === "") {
      return res.status(400).json({ error: "Role should not be empty" });
    }
    if (phoneNumber === "") {
      return res.status(400).json({ error: "PhoneNumber should not be empty" });
    }
    if (phoneNumber.length !== 10) {
      return res.status(400).json({ error: "Please enter a valid mobile number" });
    }

    // Check if email already exists
    const existingStaff = await prisma.staff.findUnique({
      where: {
        email,
      },
    });

    if (existingStaff) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create new staff member
    const createdItem = await prisma.staff.create({
      data: req.body,
    });
    await prisma.loginAuth.create({
      data: {
        name,
        role,
        email,
        password: generatedPassword(name, phoneNumber),
      },
    });

    // Send success status to the frontend
    return res
      .status(201)
      .json({ success: "Staff member added successfully", data: createdItem });
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
    res
      .status(200)
      .json({ status: "staff edited successfully", data: updatedItem });
  } catch (error) {
    console.error("Error editing item:", error);
    res
      .status(500)
      .json("An error occurred while editing the staff details", error);
  }
});
// app.put("/api/staff/active-inactive/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedItemData = req.body;
//     const updatedItem = await prisma.staff.update({
//       where: { userid: parseInt(id) },
//       data: {

//       }
//     });
//     res
//       .status(200)
//       .json({ status: "staff edited successfully", data: updatedItem });
//   } catch (error) {
//     console.error("Error editing item:", error);
//     res
//       .status(500)
//       .json("An error occurred while editing the staff details", error);
//   }
// });
app.put("/api/items/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItemData = req.body;

    console.log("Request:", req, "Updated Data:", updatedItemData);

    const updatedItem = await prisma.product.update({
      where: { ID: parseInt(id) },
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

app.post("/api/invoice/create", async (req, res) => {
  try {
    // Validate request body
    if (
      !req.body.invoiceNumber ||
      !req.body.invoiceDate ||
      !req.body.shopId ||
      !req.body.userId ||
      !req.body.total
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { invoiceNumber, products, invoiceDate, shopId, userId, total } =
      req.body;

    const shop = await prisma.shop.findUnique({ where: { shopId: shopId } });
    const user = await prisma.loginAuth.findUnique({ where: { Id: userId } });

    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    } else if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log(total);

    // Create the invoice
    const response = await prisma.invoice.create({
      data: {
        invoiceNumber,
        products,
        invoiceDate,
        shopId: shopId,
        userId: userId,
      },
    });
    await prisma.creditDebit.create({
      data: {
        invoiceNumber,
        invoiceId: response.id,
        invoiceDate,
        shopId: shopId,
        status: "Credit",
        total: total,
      },
    });
    // Update product quantities
    for (const product of products) {
      const existingProduct = await prisma.product.findUnique({
        where: { ID: product.productId },
      });
      if (!existingProduct) {
        throw new Error(`Product with ID ${product.productId} not found`);
      }
      const updatedQuantity = parseInt(existingProduct.FQTY) - product.quantity;
      await prisma.product.update({
        where: { ID: product.productId },
        data: { FQTY: updatedQuantity.toString() },
      });
    }

    res.status(201).json({ message: "Invoice created successfully" });
  } catch (error) {
    console.error("Error while creating the invoice:", error);
    res.status(500).json({ error: "An error occurred while creating invoice" });
  }
});
app.get("/api/invoices", async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        shop: true,
        user: true,
      },
    });
    res.json({ data: invoices, status: "success" });
  } catch (error) {
    console.error("Error while fetching invoices:", error);
    res.status(500).json({
      status: "failure",
      error: "An error occurred while fetching invoices",
    });
  }
});
app.get("/api/get-all-invoices-by-date", async (req, res) => {
  try {
    const { createdAt } = req.query;
    if (!createdAt)
      return res.status(400).json({
        status: "failed",
        error: "Date field shouldn't be empty",
      });

    const createdAtDate = new Date(createdAt);
    createdAtDate.setHours(0, 0, 0, 0);
    const invoices = await prisma.invoice.findMany({
      where: {
        invoiceDate: {
          gte: createdAtDate,
          lt: new Date(createdAtDate.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });
    console.log(invoices);
    //Getting the products array from the each invoices
    const invoiceProducts = invoices
      .flatMap((data) => data.products)
      .map((d) => {
        if (d.quantity === undefined) {
          return {
            ...d,
            quantity: 1,
          };
        } else {
          return d;
        }
      });

    const aggregatedProducts = invoiceProducts.reduce((acc, product) => {
      if (acc[product.productId]) {
        acc[product.productId].quantity =
          Number(acc[product.productId].quantity) + Number(product.quantity);
      } else {
        acc[product.productId] = { ...product };
      }
      return acc;
    }, {});
    const combinedProducts = Object.values(aggregatedProducts);
    const productIds = combinedProducts.map((product) => product.productId);
    const productsData = await prisma.product.findMany({
      where: {
        ID: {
          in: productIds,
        },
      },
    });
    const updatedProductList = combinedProducts.map((product) => {
      const foundProduct = productsData.find((d) => d.ID === product.productId);
      if (foundProduct) {
        return {
          ...product,
          name: foundProduct.NAME,
        };
      } else {
        return product;
      }
    });
    console.log(updatedProductList.length);
    if (updatedProductList.length > 0) {
      res.status(200).json({
        status: "success",
        invoiceDate: createdAt,
        data: updatedProductList,
        message: "products fetched successfully",
      });
    } else {
      res.status(404).json({
        status: "failure",
        message: "Invoice not generated on this date",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "failure",
      error: "An error occurred while fetching invoices",
    });
  }
});

app.post("/api/invoice/products", async (req, res) => {
  try {
    const { products } = req.body;
    if (!products || !Array.isArray(products)) {
      return res
        .status(400)
        .json({ status: "failure", error: "Invalid products" });
    }

    // Create a map to store products by productId
    const productMap = new Map();

    // Iterate through each product
    products.forEach((product) => {
      const productId = product.productId;

      if (productMap.has(productId)) {
        // If productId exists, combine the quantity
        const existingProduct = productMap.get(productId);
        existingProduct.quantity += product.quantity;
      } else {
        // If productId does not exist, add it to the map
        productMap.set(productId, { ...product });
      }
    });
    // Convert the map back to an array
    const mergedProducts = Array.from(productMap.values());

    res.status(200).json({
      status: "success",
      data: mergedProducts,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      status: "failure",
      error: "An error occurred while fetching products",
    });
  }
});

app.put("/api/invoice/update-product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        status: "failed",
        message: "Please provide the product details to update",
      });
    }

    const product = await prisma.product.findUnique({
      where: { ID: productId },
    });

    if (!product) {
      return res
        .status(404)
        .json({ status: "failed", message: "Product not found" });
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: id },
    });

    if (!invoice) {
      return res
        .status(404)
        .json({ status: "failed", message: "Invoice not found" });
    }

    const invoiceProduct = invoice.products.find(
      (p) => p.productId === productId
    );

    if (!invoiceProduct) {
      return res.status(404).json({
        status: "failed",
        message: "Product not found in this invoice",
      });
    }

    if (quantity === invoiceProduct.quantity) {
      return res
        .status(400)
        .json({ status: "failed", message: "Same quantity cannot be updated" });
    }

    let updatedProducts;
    let updatedQuantity;
    let newQuantity;

    if (quantity === 0) {
      newQuantity = invoiceProduct.quantity;
      updatedProducts = invoice.products.filter(
        (p) => productId !== p.productId
      );
    } else if (quantity > invoiceProduct.quantity) {
      updatedQuantity = quantity - invoiceProduct.quantity;
      if (product.FQTY >= updatedQuantity) {
        newQuantity = product.FQTY - updatedQuantity;
        updatedProducts = invoice.products.map((p) =>
          p.productId === productId ? { ...p, quantity } : p
        );
      } else {
        return res
          .status(400)
          .json({ status: "failed", message: "Product quantity out of stock" });
      }
    } else if (quantity < invoiceProduct.quantity) {
      updatedQuantity = invoiceProduct.quantity - quantity;
      newQuantity = product.FQTY + updatedQuantity;
      // filter a products based on quantity
      updatedProducts = invoice.products.map((p) =>
        p.productId === productId ? { ...p, quantity } : p
      );
    }

    await prisma.product.update({
      where: { ID: productId },
      data: { FQTY: JSON.stringify(newQuantity) },
    });

    await prisma.invoice.update({
      where: { id: id },
      data: { products: updatedProducts },
    });

    res.status(200).json({
      status: "success",
      message: "Product quantity updated successfully",
      data: updatedProducts,
    });
  } catch (error) {
    console.log(error, "error while updating the invoice");
    res
      .status(500)
      .json({ status: "failed", message: "Error while updating the invoice" });
  }
});

app.delete("/api/invoice/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the invoice exists
    const invoice = await prisma.invoice.findUnique({
      where: { id },
    });

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    // Perform soft delete by setting isDeleted to true
    await prisma.invoice.update({
      where: { id },
      data: { isDeleted: true },
    });

    res
      .status(200)
      .json({ status: "success", message: "Invoice deleted successfully" });
  } catch (err) {
    console.error("Error deleting invoice:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/api/supplier-bill/create", async (req, res) => {
  try {
    const {
      billNumber,
      products,
      billTotal,
      paymentMode,
      pendingPayment,
      billDate,
      address,
      userId,
      supplierId,
    } = req.body;

    // Validate each field and return specific error messages
    if (!billNumber) {
      return res.status(400).json({ error: "Bill number is required" });
    }
    if (!billTotal) {
      return res.status(400).json({ error: "Bill total is required" });
    }
    if (!paymentMode) {
      return res.status(400).json({ error: "Payment mode is required" });
    }
    if (pendingPayment === null || pendingPayment === undefined) {
      return res.status(400).json({ error: "Pending payment is required" });
    }
    if (!billDate) {
      return res.status(400).json({ error: "Bill date is required" });
    }
    if (!address) {
      return res.status(400).json({ error: "Address is required" });
    }
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    if (!supplierId) {
      return res.status(400).json({ error: "Supplier ID is required" });
    }
    if (!products || products.length === 0) {
      return res.status(400).json({ error: "Products list cannot be empty" });
    }

    // Check if supplier and user exist in the database
    const supplier = await prisma.company.findUnique({
      where: { id: supplierId },
    });
    const user = await prisma.loginAuth.findUnique({ where: { Id: userId } });

    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    } 
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create the supplier bill
    await prisma.supplierBill.create({
      data: {
        billNumber,
        billTotal,
        paymentMode,
        pendingPayment,
        billDate,
        supplierId,
        userId,
        products,
        address,
      },
    });

    res.status(201).json({ message: "Invoice created successfully" });
  } catch (error) {
    console.error("Error while creating the supplier invoice:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating supplier invoice" });
  }
});

app.put("/api/supplier-bill/update-product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        status: "failed",
        message: "Please provide the product details to update",
      });
    }

    const product = await prisma.product.findUnique({
      where: { ID: productId },
    });

    if (!product) {
      return res
        .status(404)
        .json({ status: "failed", message: "Product not found" });
    }

    const invoice = await prisma.supplierBill.findUnique({
      where: { id: id },
    });

    if (!invoice) {
      return res
        .status(404)
        .json({ status: "failed", message: "Supplier Bill not found" });
    }

    const invoiceProduct = invoice.products.find(
      (p) => p.productId === productId
    );

    if (!invoiceProduct) {
      return res.status(404).json({
        status: "failed",
        message: "Product not found in this invoice",
      });
    }

    if (quantity === invoiceProduct.quantity) {
      return res
        .status(400)
        .json({ status: "failed", message: "Same quantity cannot be updated" });
    }

    let updatedProducts;
    let updatedQuantity;
    let newQuantity;

    if (quantity === 0) {
      newQuantity = invoiceProduct.quantity;
      updatedProducts = invoice.products.filter(
        (p) => productId !== p.productId
      );
    } else if (quantity > invoiceProduct.quantity) {
      updatedQuantity = quantity - invoiceProduct.quantity;
      if (product.FQTY >= updatedQuantity) {
        newQuantity = product.FQTY - updatedQuantity;
        updatedProducts = invoice.products.map((p) =>
          p.productId === productId ? { ...p, quantity } : p
        );
      } else {
        return res
          .status(400)
          .json({ status: "failed", message: "Product quantity out of stock" });
      }
    } else if (quantity < invoiceProduct.quantity) {
      updatedQuantity = invoiceProduct.quantity - quantity;
      newQuantity = product.FQTY + updatedQuantity;
      // filter a products based on quantity
      updatedProducts = invoice.products.map((p) =>
        p.productId === productId ? { ...p, quantity } : p
      );
    }

    await prisma.product.update({
      where: { ID: productId },
      data: { FQTY: JSON.stringify(newQuantity) },
    });

    await prisma.supplierBill.update({
      where: { id: id },
      data: { products: updatedProducts },
    });

    res.status(200).json({
      status: "success",
      message: "Product quantity updated successfully",
      data: updatedProducts,
    });
  } catch (error) {
    console.log(error, "error while updating the invoice");
    res
      .status(500)
      .json({ status: "failed", message: "Error while updating the invoice" });
  }
});

app.delete("/api/supplier-bill/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the invoice exists
    const invoice = await prisma.supplierBill.findUnique({
      where: { id },
    });

    if (!invoice) {
      return res.status(404).json({ error: "Supplier Bill not found" });
    }

    // Perform soft delete by setting isDeleted to true
    await prisma.supplierBill.update({
      where: { id },
      data: { isDeleted: true },
    });

    res.status(200).json({
      status: "success",
      message: "Supplier Bill deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting invoice:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/api/supplier-bills", async (req, res) => {
  try {
    const supplierBills = await prisma.supplierBill.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        supplier: true,
        user: true,
      },
    });
    res.json({ data: supplierBills, status: "success" });
  } catch (error) {
    console.error("Error while fetching invoices:", error);
    res.status(500).json({
      status: "failure",
      error: "An error occurred while fetching invoices",
    });
  }
});

app.post("/api/update/product-stock", async (req, res) => {
  try {
    const {
      productName,
      productId,
      productQuantity,
      damagedQuantity,
      Reason,
      userId,
    } = req.body;
    if (
      !productName ||
      !productId ||
      !productQuantity ||
      !damagedQuantity ||
      !Reason ||
      !userId
    ) {
      return res.status(400).json({
        status: "failure",
        message: "missing required fields",
      });
    }
    const user = await prisma.loginAuth.findUnique({
      where: {
        Id: Number(userId),
      },
    });
    if (!user)
      return res.status(404).json({
        status: "failure",
        message: "user not found",
      });
    // Update the product's quantity
    const updatedQuantity = Number(productQuantity) - Number(damagedQuantity);
    const updatedProduct = await prisma.product.update({
      where: {
        ID: productId,
      },
      data: {
        FQTY: updatedQuantity.toString(),
      },
    });

    // Store the adjustment data in the StockAdjust table
    const stockAdjust = await prisma.stockAdjust.create({
      data: {
        productName: productName,
        productId: Number(productId),
        productQuantity: Number(productQuantity),
        Reason: Reason,
        damagedQuantity: Number(damagedQuantity),
        userId: Number(userId),
      },
    });

    // Respond with success message
    res.status(200).json({
      status: "success",
      message: "Product stock updated successfully",
      data: {
        updatedProduct: updatedProduct,
        stockAdjust: stockAdjust,
      },
    });
  } catch (error) {
    console.error("Error while updating product stock:", error); // Log the error for debugging
    res.status(500).json({
      status: "failure",
      message: "Error while updating product stock",
      error: error.message,
    });
  }
});
app.get("/api/get-products/based-on-area", async (req, res) => {
  try {
    const { area, invoiceDate } = req.query;
    console.log(area, invoiceDate);
    if (!area) {
      return res
        .status(400)
        .json({ message: "Area field shouldn't be empty", status: "failure" });
    }
    if (!invoiceDate) {
      return res
        .status(400)
        .json({ message: "Date field shouldn't be empty", status: "failure" });
    }
    const createdAtDate = new Date(invoiceDate);
    createdAtDate.setHours(0, 0, 0, 0);
    const invoices = await prisma.invoice.findMany({
      where: {
        invoiceDate: {
          gte: createdAtDate,
          lt: new Date(createdAtDate.getTime() + 24 * 60 * 60 * 1000),
        },
        shop: {
          ZONNAM: area,
        },

      },
      include: {
        shop: true,
      }
    });

    //Getting the products array from the each invoices
    const invoiceProducts = invoices
      .flatMap((data) => data.products)
      .map((d) => {
        if (d.quantity === undefined) {
          return {
            ...d,
            quantity: 1,
          };
        } else {
          return d;
        }
      });

    const aggregatedProducts = invoiceProducts.reduce((acc, product) => {
      console.log(product.quantity);
      if (acc[product.productId]) {
        acc[product.productId].quantity =
          Number(acc[product.productId].quantity) + Number(product.quantity);
      } else {
        acc[product.productId] = { ...product };
      }
      return acc;
    }, {});
    const combinedProducts = Object.values(aggregatedProducts);
    const productIds = combinedProducts.map((product) => product.productId);
    const productsData = await prisma.product.findMany({
      where: {
        ID: {
          in: productIds,
        },
      },
    });
    const updatedProductList = combinedProducts.map((product) => {
      const foundProduct = productsData.find((d) => d.ID === product.productId);
      if (foundProduct) {
        return {
          ...product,
          name: foundProduct.NAME,
        };
      } else {
        return product;
      }
    });
    if (updatedProductList.length > 0) {
      res.status(200).json({
        status: "success",
        invoiceDate: invoiceDate,
        invoiceArea: area,
        data: updatedProductList,
        allInvoices: invoices,
        message: "products fetched successfully",
      });
    } else {
      res.status(404).json({
        status: "failure",
        message: "Products not found on this date and area",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failure", error: "Internal server error" });
  }
});
//* Check product availability
app.get("/api/product/availability-check", async (req, res) => {
  try {
    // Extract product ID and requested quantity from the request query
    const { productId, requestedQuantity } = req.query;

    if (!productId || !requestedQuantity) {
      return res
        .status(400)
        .json({ error: "Product ID and requested quantity are required." });
    }

    // Convert requestedQuantity to a number
    const requestedQty = parseInt(requestedQuantity);

    if (isNaN(requestedQty) || requestedQty <= 0) {
      return res
        .status(400)
        .json({ error: "Requested quantity must be a positive number." });
    }

    // Fetch the product from the database
    const product = await prisma.product.findUnique({
      where: { ID: parseInt(productId) },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    const availableQty = parseInt(product.FQTY) || 0;
    // Check if the product has enough quantity
    const isAvailable = availableQty >= requestedQty;

    res.status(200).json({
      productId: product.ID,
      productName: product.CNAME,
      availableQuantity: availableQty,
      requestedQuantity: requestedQty,
      isAvailable,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while checking product availability.",
    });
  }
});

//* Get products based on companyName and date
app.post("/api/products/by-company-date", async (req, res) => {
  const { companyName, month, year } = req.body;

  if (!companyName || !month || !year) {
    return res.status(400).json({ status: 'failure', message: 'Missing required fields' });
  }

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  try {
    const invoices = await prisma.invoice.findMany({
      where: {
        invoiceDate: {
          gte: startDate,
          lt: endDate
        },
      },
      select: {
        products: true,
      }
    });

    const newArray = invoices.map((invoice) => {
      return invoice.products;
    });
    const updatedArray = newArray.flat();

    const filteredProducts = updatedArray.filter(product => product.companyName === companyName);
    const productMap = new Map();
    for (let product of filteredProducts) {
      const productId = product.productId;
      if (productMap.has(productId)) {
        const existingProduct = productMap.get(productId);
        existingProduct.quantity += Number(product.quantity);
        existingProduct.totalWithGST += Number(product.totalWithGST);
      } else {
        productMap.set(productId, product)
      }
    }
    const mergedProducts = Array.from(productMap.values());
    const totalProductAmount = mergedProducts.reduce((acc, curr) => {
      return acc += Number(curr.totalWithGST);
    }, 0);
    const parsedAmount = Number(parseFloat(totalProductAmount).toFixed(2));
    if (mergedProducts.length === 0) {
      return res.status(400).json({ status: 'failure', message: 'No data found!' });
    }
    return res.json({ status: 'success', message: 'Data fetched successfully', data: mergedProducts, totalAmount: parsedAmount, totalCount: filteredProducts.length });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'failure', message: 'Internal server error' });
  }
});
//* Get products based on Zone, shop and date
app.post("/api/products/by-zone-shop-date", async (req, res) => {
  const { zoneName, shopName, month, year } = req.body;

  if (!zoneName || !month || !year) {
    return res.status(400).json({ status: 'failure', message: 'Missing required fields' });
  }

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  try {
    const whereClause = {
      invoiceDate: {
        gte: startDate,
        lt: endDate
      },
      shop: {
        ZONNAM: zoneName,
      },
    };

    if (shopName) {
      whereClause.shop.CUSNAM = shopName;
    }

    const invoices = await prisma.invoice.findMany({
      where: whereClause,
      select: {
        products: true,
      }
    });

    const newArray = invoices.map((invoice) => invoice.products);
    const updatedArray = newArray.flat();

    const productMap = new Map();
    updatedArray.forEach((product) => {
      const productId = product.productId;
      if (productMap.has(productId)) {
        const existingProduct = productMap.get(productId);
        existingProduct.quantity += Number(product.quantity);
        existingProduct.totalWithGST += Number(product.totalWithGST);
      } else {
        productMap.set(productId, product);
      }
    });

    const mergedProducts = Array.from(productMap.values());
    const totalProductAmount = mergedProducts.reduce((acc, curr) => acc += Number(curr.totalWithGST), 0);
    const parsedAmount = Number(parseFloat(totalProductAmount).toFixed(2));

    if (mergedProducts.length === 0) {
      return res.status(400).json({ status: 'failure', message: 'No data found!' });
    }

    return res.json({
      status: 'success',
      message: 'Data fetched successfully',
      data: mergedProducts,
      totalAmount: parsedAmount,
      totalCount: updatedArray.length
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'failure', message: 'Internal server error' });
  }
});

// Get all zone name values
app.get("/api/get-all-zone-name", async (req, res) => {
  try {
    const zones = await prisma.shop.findMany({
      select: { ZONNAM: true },
    });
    const zoneNames = [
      ...new Set(
        zones
          .map((shop) => shop.ZONNAM)
          .filter((zonName) => zonName.trim() !== "")
      ),
    ];
    res.status(200).json({ status: "success", data: zoneNames });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failure", error: "Internal server error" });
  }
});
app.get("/api/invoice/overall-count", async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany();
    res.json({ count: invoices.length + 1 });
  } catch (error) {
    console.error("Error while fetching invoices:", error);
    res.status(500).json({
      status: "failure",
      error: "An error occurred while fetching invoices count",
    });
  }
});

//* Assign delivery agent
app.post("/api/shop/assign-delivery-agent", async (req, res) => {
  try {
    const { areas, date, staffId, deliveryDate } = req.body;

    if (!areas || !date || !staffId || !deliveryDate) {
      return res.status(400).json({ status: 'failure', message: 'Missing required fields' });
    }

    const deliveryAgent = await prisma.staff.findUnique({
      where: { userid: staffId },
    });

    if (!deliveryAgent) {
      return res.status(400).json({ status: 'failure', message: 'Delivery agent not found!' });
    }

    if (deliveryAgent.isActive) {
      return res.status(400).json({ status: 'failure', message: 'Delivery agent already assigned' });
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);

    const invoices = await prisma.invoice.findMany({
      where: {
        invoiceDate: {
          gte: startDate,
          lt: endDate,
        },
        status: 'NOT_DELIVERED',
        shop: {
          ZONNAM: { in: areas },
        },
      },
      include: {
        shop: true,
      },
    });
    if (invoices.length === 0) {
      return res.status(400).json({ status: 'failure', message: 'No invoices found for the specified areas and date' });
    }

    const unmatchedAreas = areas.filter(area => !invoices.some(invoice => invoice.shop.ZONNAM === area));

    if (unmatchedAreas.length > 0) {
      return res.status(400).json({
        status: 'failure',
        message: `The following areas do not match any shop names: ${unmatchedAreas.join(', ')}`,
      });
    }
    const getTotalCount = (products) => {
      return products.reduce((acc, curr) => {
        return acc + Number(curr.totalWithGST);
      }, 0);
    }
    const shopDetails = invoices.map(invoice => ({
      ...invoice,
      shop: { ...invoice.shop, status: 'NOT_COMPLETED' },
      totalAmount: getTotalCount(invoice.products),
      invoiceId: invoice.id,
    }));

    await prisma.delivery.create({
      data: {
        staffId,
        shops: shopDetails,
        invoiceDate: new Date(date),
        deliveryDate: new Date(deliveryDate),
        areas,
      },
    });
    await prisma.staff.update({
      where: {
        userid: staffId,
      },
      data: {
        isActive: true,
      }
    })
    const invoiceIds = invoices.map((invoice) => invoice.id);
    await prisma.invoice.updateMany({
      where: {
        id: {
          in: invoiceIds,
        },
      },
      data: {
        status: 'ASSIGNED',
      },
    });
    return res.json({ status: 'success', message: 'Delivery agent assigned successfully' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'failure', message: 'Internal server error' });
  }
});

//* Assign pending delivery
app.post("/api/assign/pending/delivery", async(req, res) =>{
  try{
const { invoices, staffId } = req.body;
if(invoices.length === 0){
  return res.status(400).json({ status: 'failure', message: 'Invoice list empty' });
}
if(!staffId){
  return res.status(400).json({ status: 'failure', message: 'StaffId should not be empty' });
}
invoices.forEach(async (invoice) => {
  const { invoiceDate, shop} = invoice;
  const getTotalCount = (products) => {
    return products.reduce((acc, curr) => {
      return acc + Number(curr.totalWithGST);
    }, 0);
  }
  const shopDetails = invoices.map(invoice => ({
    ...invoice,
    shop: { ...invoice.shop, status: 'NOT_COMPLETED' },
    totalAmount: getTotalCount(invoice.products),
    invoiceId: invoice.id,
  }));
const invoiceData = {
  staffId,
  shops: shopDetails,
  invoiceDate,
  deliveryDate: new Date(),
  areas: [shop.ZONNAM],
  status: 'ASSIGNED',
}
console.log(invoiceData);
  await prisma.delivery.create({
    data: {
      staffId,
      shops: shopDetails,
      invoiceDate,
      deliveryDate: new Date(),
      areas: [shop.ZONNAM],
    },
  });
  await prisma.invoice.update({
    where: {
      id: invoice.id,
      },
      data: {
        status: 'ASSIGNED',
      }
  })
})
return res.status(200).json({ status: 'success', message: 'Delivery Assigned Successfully' });
  }catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'failure', message: 'Internal server error' });
  }
})

// fetch delivery assigned agent
app.get("/api/fetch/assigned-delivery-agent", async (req, res) => {
  const { userId, date } = req.query;
  try {
    if (!userId || !date) {
      return res.status(400).json({ status: 'failure', message: 'missing required fields' });
    }

    const parsedUserId = Number(userId);
    if (isNaN(parsedUserId)) {
      return res.status(400).json({ status: 'failure', message: 'Invalid userId format' });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ status: 'failure', message: 'Invalid date format' });
    }

    const startDate = new Date(parsedDate.setUTCHours(0, 0, 0, 0));
    const endDate = new Date(parsedDate.setUTCHours(23, 59, 59, 999));
    const data = await prisma.delivery.findMany({
      where: {
        staffId: parsedUserId,
        deliveryDate: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    if (data.length === 0) {
      return res.status(404).json({ status: 'failure', message: 'Delivery details not found on this date or delivery agent' });
    }
    const deliveryDetails = data.map((delivery) => {
      const details = delivery.areas.map((area) => {
        const filteredShopDetails = delivery.shops.filter((shop) => {
          return area === shop.shop.ZONNAM
        });
        return {
          zoneName: area,
          shops: filteredShopDetails,
        };
      });
      return {
        id: delivery.id,
        assignedDate: delivery.assignedDate,
        invoiceDate: delivery.invoiceDate,
        staffId: delivery.staffId,
        status: delivery.status,
        createdAt: delivery.createdAt,
        updatedAt: delivery.updatedAt,
        isDeleted: delivery.isDeleted,
        details,
      };
    });

    res.status(200).json({ status: 'success', data: deliveryDetails[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'failure', message: 'Internal server error' });
  }
});

app.patch("/api/update/assigned-delivery-agent/shop", async (req, res) => {
  const { shopId, deliveryId, paidAmount, email } = req.body;

  if (!shopId || !deliveryId || !paidAmount || !email) {
    return res.status(400).json({
      status: 'failed',
      message: 'shopId, deliveryId, paidAmount, and email are required'
    });
  }

  try {
    const delivery = await prisma.delivery.findUnique({
      where: { id: deliveryId }
    });

    if (!delivery) {
      return res.status(404).json({
        status: 'failure',
        message: 'Delivery details not found for the specified user'
      });
    }

    // Find the shop detail within the delivery
    const shopDetail = delivery.shops.find(shop => shop.shop.shopId === shopId);

    if (!shopDetail) {
      return res.status(404).json({
        status: 'failure',
        message: 'Shop details not found in the delivery'
      });
    }

    if (shopDetail.totalAmount < paidAmount) {
      return res.status(400).json({
        status: 'failed',
        message: 'paidAmount shouldn\'t be greater than the shop amount'
      });
    }

    const updatedShops = delivery.shops.map((shop) => {
      if (shop.shop.shopId === shopId) {
        return {
          ...shop,
          shop: {
            ...shop.shop,
            paidAmount: paidAmount,
            status: 'COMPLETED',
            paidAt: new Date(),
          }
        };
      } else {
        return shop;
      }
    });

    await prisma.delivery.update({
      where: { id: deliveryId },
      data: { shops: updatedShops },
    });

    await prisma.invoice.update({
      where: {
        id: shopDetail.invoiceId,
      },
      data: {
        status: 'COMPLETED',
      }
    })

    res.status(200).json({
      status: 'success',
      message: 'Shop details updated successfully'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'failure',
      message: 'Internal server error'
    });
  }
});



// fetch assigned delivery for delivery agent
app.get("/api/fetch/assigned-delivery", async (req, res) => {
  const { email, date } = req.query;
  try {
    if (!email || !date) {
      return res.status(400).json({ status: 'failure', message: 'missing required fields' });
    }

    const deliveryAgent = await prisma.staff.findUnique({
      where: {
        email,
      }
    });
    if (!deliveryAgent) {
      return res.status(404).json({ status: 'failure', message: 'Delivery agent not found' });
    }
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ status: 'failure', message: 'Invalid date format' });
    }

    const startDate = new Date(parsedDate.setUTCHours(0, 0, 0, 0));
    const endDate = new Date(parsedDate.setUTCHours(23, 59, 59, 999));
    const data = await prisma.delivery.findMany({
      where: {
        staffId: deliveryAgent.userid,
        deliveryDate: {
          gte: startDate,
          lte: endDate
        }
      }
    });
    if (data.length === 0) {
      return res.status(200).json({ status: 'success', message: 'data fetched successfully', data });
    }
    const deliveryDetails = data.map((delivery) => {
      const details = delivery.areas.map((area) => {
        const filteredShopDetails = delivery.shops.filter((shop) => {
          return area === shop.shop.ZONNAM
        });
        return {
          zoneName: area,
          shops: filteredShopDetails,
        };
      });
      return {
        id: delivery.id,
        assignedDate: delivery.assignedDate,
        invoiceDate: delivery.invoiceDate,
        staffId: delivery.staffId,
        status: delivery.status,
        createdAt: delivery.createdAt,
        updatedAt: delivery.updatedAt,
        isDeleted: delivery.isDeleted,
        details,
      };
    });

    res.status(200).json({ status: 'success', data: deliveryDetails[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'failure', message: 'Internal server error' });
  }
});


app.get("/api/fetch/deliveryAgents", async (req, res) => {
  try {
    const shops = await prisma.staff.findMany({ where: { role: UserRoles.DELIVERY } });
    res.json(shops);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the delivery guys" });
  }
});

app.post("/api/products/by-date-report", async (req, res) => {
  const { typeName, month, year } = req.body;

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);
  let invoices;
  let salesArray = [];
  let salesMap = new Map();
  try {
    if (!typeName || !month || !year) {
      return res.status(404).json({ status: 'failed', message: 'Missing required fields' })
    }

    if (typeName === 2 || typeName === 3) {
      invoices = await prisma.invoice.findMany({
        where: {
          invoiceDate: {
            gte: startDate,
            lt: endDate
          },
        },
        include: {
          shop: true,
        },
      });

      for (let invoice of invoices) {
        const customerName = invoice.shop.CUSNAM;
        if (salesMap.has(customerName)) {
          const existingProduct = salesMap.get(customerName);
          existingProduct.sales.push({
            invoiceId: invoice.id,
            invoiceDate: invoice.invoiceDate,
            invoiceNumber: invoice.invoiceNumber,
            products: invoice.products,
          });
        } else {
          salesMap.set(customerName, {
            Slno: invoice.shop.SLNO,
            sales: [{
              invoiceId: invoice.invoiceNumber,
              invoiceDate: invoice.invoiceDate,
              products: invoice.products,
            }]
          });
        }
      }

    }
    else if (typeName === 1) {
      invoices = await prisma.supplierBill.findMany({
        where: {
          billDate: {
            gte: startDate,
            lt: endDate
          },
        },
        include: {
          supplier: true,
        },
      });
      for (let invoice of invoices) {
        const customerName = invoice.supplier.cName;
        if (salesMap.has(customerName)) {
          const existingProduct = salesMap.get(customerName);
          existingProduct.sales.push({
            invoiceId: invoice.id,
            invoiceDate: invoice.invoiceDate,
            products: invoice.products,
          });
        } else {
          salesMap.set(customerName, {
            gstin: invoice.supplier.gstin,
            sales: [{
              invoiceId: invoice.billNumber,
              invoiceDate: invoice.invoiceDate,
              products: invoice.products,
            }]
          });
        }
      }
    }
    // Convert salesMap to an array of objects
    salesArray = Array.from(salesMap.entries()).map(([customerName, details]) => ({
      [customerName]: details
    }));

    return res.json({
      status: 'success',
      message: 'Data fetched successfully',
      data: salesArray,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'failure', message: 'Internal server error' });
  }
});

app.get("/api/fetch/current-day-delivery", async (req, res) => {
  try {

    const dateStr = req.query.date;

    // Convert the date string to a Date object
    const date = new Date(dateStr);

    if (isNaN(date)) {
      return res.status(400).send('Invalid date');
    }

    // Set the start and end dates
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const data = await prisma.delivery.findMany({
      where: {
        deliveryDate: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        staff: true
      }
    });

    if (data.length === 0) {
      return res.status(404).json({ status: 'failure', message: 'Delivery details not found on this date or delivery agent' });
    }


    res.status(200).json({ status: 'success', data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'failure', message: 'Internal server error' });
  }
});

app.post("/api/update/invoice-status", async (req, res) => {

  const { invoiceIds, staffId, deliveryId } = req.body;
  try {
    const updateResult = await prisma.invoice.updateMany({
      where: {
        id: {
          in: invoiceIds,
        },
      },
      data: {
        status: "PENDING",
      },
    });

    await prisma.delivery.update({
      where: { id: deliveryId },
      data: { status: 'COMPLETED' },
    });

    await prisma.staff.update({
      where: { userid: staffId },
      data: { isActive: false }
    });

    res.json({
      success: true,
      message: `${updateResult.count} invoices updated to PENDING status`,
    });
  } catch (error) {
    console.error("Error updating invoices:", error.message);
    res.status(500).json({
      success: false,
      message: "Error updating invoices",
    });
  }
});

app.post("/api/update/credit-debit", async (req, res) => {
  try {
    const invoices = req.body; // Assuming req.body is an array of objects
    for (const { invoiceId, paidAmount } of invoices) {
      
      const creditRecord = await prisma.creditDebit.findFirst({
        where: {
          invoiceId,
        }
      });
      if (creditRecord) {
        let newTotal = creditRecord.total - parseFloat(paidAmount);
        let newStatus = '';
        if (newTotal === 0) {
          newStatus = 'Tally';
        } else if (newTotal > 0) {
          newStatus = 'Credit';
        } else {
          newTotal = Math.abs(newTotal);
          newStatus = 'Debit';
        }
        await prisma.creditDebit.update({
          where: {
            invoiceId,
          },
          data: {
            total: newTotal,
            status: newStatus
          }
        });
      }
    }

    res.status(200).json({ message: 'Invoices updated successfully' });
  } catch (error) {
    console.error('Error updating invoices:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});
;

app.get("/api/fetch/supplier", async (req, res) => {
  try {
    await prisma.company.findMany();
    res.status(200).json({ status: 'success', message: 'Supplier fetch successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'failure',
      message: 'Internal server error'
    });
  }
});

app.post("/api/company/create", async (req, res) => {
  try {
     // Regular expression for validating an Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const { cName, cShort, address, email, phoneNumber, gstin, stateCode } = req.body;
    if (!cName) {
      return res.status(404).json({ status: 'failed', message: 'Company name is required' });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ status: 'failed', message: "Invalid email format" });
    }
    await prisma.company.create({
      data: {
        cName,
        ...(cShort ? { cShort } : {}),
        ...(address ? { address } : {}),
        ...(email ? { email } : {}),
        ...(phoneNumber ? { phoneNumber } : {}),
        ...(gstin ? { gstin } : {}),
        ...(stateCode ? { stateCode } : {}),
      },
    });
    res.status(200).json({ status: 'success', message: 'Supplier created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'failure',
      message: 'Internal server error'
    });
  }
});

app.put("/api/company/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { cName, cShort, address, email, phoneNumber, gstin, stateCode } = req.body;
    if (!cName || !id) {
      return res.status(404).json({ status: 'failed', message: 'Missing required fields' });
    }
    await prisma.company.update({
      where: {
        id: Number(id),
      },
      data: {
        cName,
        ...(cShort ? { cShort } : {}),
        ...(address ? { address } : {}),
        ...(email ? { email } : {}),
        ...(phoneNumber ? { phoneNumber } : {}),
        ...(gstin ? { gstin } : {}),
        ...(stateCode ? { stateCode } : {}),
      },
    });
    res.status(200).json({ status: 'success', message: 'Supplier updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'failure',
      message: 'Internal server error'
    });
  }
});

app.post("/api/update/debitcredit", async (req, res) => {
  const { selectedData, tallyText } = req.body;

  try {
    const tallyAmount = parseFloat(tallyText);
    
    const updatedData = await prisma.creditDebit.update({
      where: {
        id: selectedData.id,
      },
      data: {
        total: {
          decrement: tallyAmount,
        },
        updatedAt: new Date(), 
      },
    });

    res.status(200).json({ status: 'success', data: updatedData, message: 'Credit details updated successfully' });
  } catch (error) {
    console.error("Error during update:", error);
    res.status(500).json({ message: "An error occurred while updating the Credit details" });
  }
});

app.get("/api/fetch/invoices", async (req, res) => {
  try {
    const {startingNuber, endingNumber} = req.query;
    if(!startingNuber) return res.status(400).json({ status: 'failure', message: 'Starting number should not be empty' });
    if(!endingNumber) return res.status(400).json({ status: 'failure', message: 'Ending number should not be empty' });
    const invoices = await prisma.invoice.findMany({
      where: {
invoiceNumber: {
  gte: Number(startingNuber),
  lte: Number(endingNumber),
}
      },
      include:{
        shop: true,
      }
    });
    if(invoices.length === 0) return res.status(400).json({ status: 'failure', message: 'Inovice not found' });

    res.status(200).json({ status: 'success', message: 'invoice fetch successfully', data: invoices });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'failure',
      message: 'Internal server error'
    });
  }
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});