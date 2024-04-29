const express = require("express");
const prisma = require("./prisma/prismaClient");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

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

app.get("/api/staff/staffDetails", async (req, res) => {
  try {
    const staffs = await prisma.staff.findMany();
    res.status(200).json({ success: 'staff data fetched successfully', data: staffs});
  } catch (error) {
    console.error("Error fetching staffs:", error);
    res.status(500).json({ error: "An error occurred while fetching the staffs" });
  }
});

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
      .json({ error: "An error occurred while fetching the companies" });
  }
});

app.get("/api/user/fetchUsers", async (req, res) => {
  try {
    const users = await prisma.LoginAuth.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the companies" });
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
