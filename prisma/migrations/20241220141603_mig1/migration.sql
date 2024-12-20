/*
  Warnings:

  - The primary key for the `Business` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Purchase` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Sale` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SaleItem` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_productId_fkey";

-- DropForeignKey
ALTER TABLE "SaleItem" DROP CONSTRAINT "SaleItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "SaleItem" DROP CONSTRAINT "SaleItem_saleId_fkey";

-- AlterTable
ALTER TABLE "Business" DROP CONSTRAINT "Business_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Business_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Product_id_seq";

-- AlterTable
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "productId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Purchase_id_seq";

-- AlterTable
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Sale_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Sale_id_seq";

-- AlterTable
ALTER TABLE "SaleItem" DROP CONSTRAINT "SaleItem_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "saleId" SET DATA TYPE TEXT,
ALTER COLUMN "productId" SET DATA TYPE TEXT,
ADD CONSTRAINT "SaleItem_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "SaleItem_id_seq";

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
