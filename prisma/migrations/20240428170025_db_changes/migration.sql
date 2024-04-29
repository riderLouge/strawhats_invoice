-- CreateTable
CREATE TABLE "Staff" (
    "userid" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" BIGINT NOT NULL,
    "address" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "shopId" INTEGER NOT NULL,
    "photo" TEXT NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("userid")
);

-- CreateTable
CREATE TABLE "Shop" (
    "shopId" SERIAL NOT NULL,
    "GRPNAM" TEXT NOT NULL,
    "CUSNAM" TEXT NOT NULL,
    "ADRONE" TEXT NOT NULL,
    "ADRTWO" TEXT NOT NULL,
    "ADRTHR" TEXT NOT NULL,
    "ADRFOU" TEXT NOT NULL,
    "PLC" TEXT NOT NULL,
    "PINCOD" TEXT NOT NULL,
    "CNTPER" TEXT NOT NULL,
    "SLNO" TEXT NOT NULL,
    "TNGST" TEXT NOT NULL,
    "TELNUM" TEXT NOT NULL,
    "ZONNAM" TEXT NOT NULL,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("shopId")
);

-- CreateTable
CREATE TABLE "LoginAuth" (
    "Id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "LoginAuth_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Product" (
    "ID" SERIAL NOT NULL,
    "CNAME" TEXT NOT NULL,
    "NAME" TEXT NOT NULL,
    "MRP" TEXT NOT NULL,
    "PPRICE" TEXT NOT NULL,
    "SPRICE" TEXT NOT NULL,
    "GST" TEXT NOT NULL,
    "HSN" TEXT NOT NULL,
    "CESSP" TEXT NOT NULL,
    "CMCODE" TEXT NOT NULL,
    "FITEC" TEXT NOT NULL,
    "FQTY" TEXT NOT NULL,
    "FREE" TEXT NOT NULL,
    "DISCP" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "StockAdjust" (
    "ID" SERIAL NOT NULL,
    "productID" INTEGER NOT NULL,
    "FQTY" TEXT NOT NULL,
    "Reason" TEXT NOT NULL,
    "DQTY" TEXT NOT NULL,

    CONSTRAINT "StockAdjust_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "cName" TEXT NOT NULL,
    "cShort" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "customerId" SERIAL NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerType" TEXT NOT NULL,
    "customerAddress" TEXT NOT NULL,
    "customerPhoneNumber" BIGINT NOT NULL,
    "shopId" INTEGER NOT NULL,
    "ladtOrder" TIMESTAMP(3) NOT NULL,
    "pendingBalance" INTEGER NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("customerId")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "invoiceNumber" INTEGER NOT NULL,
    "products" JSONB[],
    "currentPrice" INTEGER NOT NULL,
    "invoiceDate" TIMESTAMP(3) NOT NULL,
    "shopId" INTEGER NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("invoiceNumber")
);

-- CreateTable
CREATE TABLE "CreditDebit" (
    "invoiceNumber" INTEGER NOT NULL,
    "invoiceDate" TIMESTAMP(3) NOT NULL,
    "shopId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "pending" INTEGER NOT NULL,

    CONSTRAINT "CreditDebit_pkey" PRIMARY KEY ("invoiceNumber")
);

-- CreateTable
CREATE TABLE "SupplierBill" (
    "billNumber" INTEGER NOT NULL,
    "billTotal" INTEGER NOT NULL,
    "paymentMode" TEXT NOT NULL,
    "pendingPayment" INTEGER NOT NULL,
    "billDate" TIMESTAMP(3) NOT NULL,
    "billedProducts" JSONB[],

    CONSTRAINT "SupplierBill_pkey" PRIMARY KEY ("billNumber")
);

-- CreateTable
CREATE TABLE "Delivery" (
    "id" INTEGER NOT NULL,
    "billNumbers" INTEGER[],
    "date" TIMESTAMP(3) NOT NULL,
    "staffId" INTEGER NOT NULL,
    "area" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Staff_email_key" ON "Staff"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Shop_shopId_key" ON "Shop"("shopId");

-- CreateIndex
CREATE UNIQUE INDEX "LoginAuth_email_key" ON "LoginAuth"("email");
