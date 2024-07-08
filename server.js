const express = require("express");
const prisma = require("./prisma/prismaClient");
const nodemailer = require("nodemailer");
const app = express();
const cors = require("cors");

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
    // validate request body

    if (
      !req.body.billNumber ||
      !req.body.billTotal ||
      !req.body.paymentMode ||
      !req.body.pendingPayment
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }
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

    const supplier = await prisma.company.findUnique({
      where: { id: supplierId },
    });
    const user = await prisma.loginAuth.findUnique({ where: { Id: userId } });

    if (!supplier) {
      return res.status(404).json({ error: "supplier not found" });
    } else if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create the invoice
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
        existingProduct.quantity += product.quantity;
        existingProduct.totalWithGST += product.totalWithGST;
      } else {
        productMap.set(productId, product)
      }
    }
    const mergedProducts = Array.from(productMap.values());
    const totalProductAmount = mergedProducts.reduce((acc, curr) => {
      return acc += curr.totalWithGST;
    }, 0);
    const parsedAmount = Number(parseFloat(totalProductAmount).toFixed(2));
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
        existingProduct.quantity += product.quantity;
        existingProduct.totalWithGST += product.totalWithGST;
      } else {
        productMap.set(productId, product);
      }
    });

    const mergedProducts = Array.from(productMap.values());
    const totalProductAmount = mergedProducts.reduce((acc, curr) => acc += curr.totalWithGST, 0);
    const parsedAmount = Number(parseFloat(totalProductAmount).toFixed(2));

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
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/api/fetch/deliveryAgents", async (req, res) => {
  try {
    const shops = await prisma.staff.findMany({ where: { role: "delivery" } });
    res.json(shops);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the delivery guys" });
  }
});