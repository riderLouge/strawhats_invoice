const express = require("express");
const prisma = require("./prisma/prismaClient");
const app = express();

app.use(express.json());

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

app.post("/api/items/insert", async (req, res) => {
  try {
    const modifiedData = req.body;
    let idCounter = 1;
    console.log(modifiedData[0]);
    for (const data of modifiedData) {
      await prisma.Product.create({
        data: {
          id: idCounter,
          CNAME: data.CNAME ? data.CNAME : null,
          NAME: data.NAME ? data.NAME : null,
          MRP: data.MRP ? data.MRP : null,
          PPRICE: data.PPRICE ? data.PPRICE : null,
          SPRICE: data.SPRICE ? data.SPRICE : null,
          GST: data.GST ? data.GST : null,
          HSN: data.HSN ? data.HSN : null,
          CESSP: data.CESSP ? data.CESSP : null,
          FITEC: data.FITEC ? data.FITEC : null,
          FQTY: data.FQTY ? data.FQTY : null,
          FREE: data.FREE ? data.FREE : null,
          DISCP: data.DISCP ? data.DISCP : null,
        },
      });
      idCounter++;
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
