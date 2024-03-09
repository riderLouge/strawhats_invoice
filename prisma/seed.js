const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const companyNames = [
    {
      cName: "ASIA CANDY",
      cShort: "ASIA",
    },
    {
      cName: "BEIERSDORF INDIA PVT LTD",
      cShort: "BAND",
    },
    {
      cName: "DRISHTI FB",
      cShort: "DRSTI",
    },
    {
      cName: "FRIENDS DIAPERS",
      cShort: "FRIEN",
    },
    {
      cName: "GANAPATHY SEMIYA",
      cShort: "GAN",
    },
    {
      cName: "GOKULAM DATES",
      cShort: "GOKUL",
    },
    {
      cName: "HALDIRAM'S",
      cShort: "HALDR",
    },
    {
      cName: "HEARTY FEEDING BOTTLE",
      cShort: "HEART",
    },
    {
      cName: "HUGGIES",
      cShort: "HUGGS",
    },
    {
      cName: "K.P.L.COCONUT OIL",
      cShort: "KPL",
    },
    {
      cName: "LOTTE INDIA CORPORATION LTD",
      cShort: "LOTTE",
    },
    {
      cName: "MUGI",
      cShort: "MUGI",
    },
    {
      cName: "NATRAJ OIL MILLS (P) LTD",
      cShort: "ANJLI",
    },
    {
      cName: "PASS PASS",
      cShort: "PASS",
    },
    {
      cName: "RAS OIL",
      cShort: "RAS",
    },
    {
      cName: "RICHEESE WAFER",
      cShort: "RICHE",
    },
    {
      cName: "TIGER BALM",
      cShort: "58697",
    },
    {
      cName: "UNITED FOODS",
      cShort: "UF",
    },
    {
      cName: "USHODAYA ENTERPRISES LTD",
      cShort: "PRIYA",
    },
    {
      cName: "VIKAAS FOOD PRODUCTS",
      cShort: "JAM",
    },
  ];

  for (const userData of companyNames) {
    await prisma.Company.create({
      data: userData,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
