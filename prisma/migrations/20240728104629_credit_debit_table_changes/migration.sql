/*
  Warnings:

  - A unique constraint covering the columns `[invoiceId]` on the table `CreditDebit` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CreditDebit_invoiceId_key" ON "CreditDebit"("invoiceId");
