const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const companyNames = [
    {
      cName: "ASIA CANDY",
      cShort: "ASIA",
      address:"",
      email:"",
      phoneNumber:"",
      gstin:"",
      stateCode:"",
    },
    {
      cName: "BEIERSDORF INDIA PVT LTD",
      cShort: "BAND",
      address:"",
      email:"",
      phoneNumber:"",
      gstin:"",
      stateCode:"",
    },
    {
      cName: "DRISHTI FB",
      cShort: "DRSTI",
      address:"",
      email:"",
      phoneNumber:"",
      gstin:"",
      stateCode:"",
    },
    {
      cName: "FRIENDS DIAPERS",
      cShort: "FRIEN",
      address:"",
      email:"",
      phoneNumber:"",
      gstin:"",
      stateCode:"",
    },
    {
      cName: "GANAPATHY SEMIYA",
      cShort: "GAN",
      address:"",
      email:"",
      phoneNumber:"",
      gstin:"",
      stateCode:"",
    },
    {
      cName: "GOKULAM DATES",
      cShort: "GOKUL",
      address:"",
      email:"",
      phoneNumber:"",
      gstin:"",
      stateCode:"",
    },
    {
      cName: "HALDIRAM'S",
      cShort: "HALDR",
      address:"",
      email:"",
      phoneNumber:"",
      gstin:"",
      stateCode:"",
    },
    {
      cName: "HEARTY FEEDING BOTTLE",
      cShort: "HEART",
      address:"",
      email:"",
      phoneNumber:"",
      gstin:"",
      stateCode:"",
    },
    {
      cName: "HUGGIES",
      cShort: "HUGGS",
      address:"",
      email:"",
      phoneNumber:"",
      gstin:"",
      stateCode:"",
    },
    {
      cName: "K.P.L.COCONUT OIL",
      cShort: "KPL",
      address:"",
      email:"",
      phoneNumber:"",
      gstin:"",
      stateCode:"",
    },
    {
      cName: "LOTTE INDIA CORPORATION LTD",
      cShort: "LOTTE",
      address:"",
      email:"",
      phoneNumber:"",
      gstin:"",
      stateCode:"",
    },
    {
      cName: "MUGI",
      cShort: "MUGI",
      address:"",
      email:"",
      phoneNumber:"",
      gstin:"",
      stateCode:"",
    },
    {
      cName: "NATRAJ OIL MILLS (P) LTD",
      cShort: "ANJLI",
      address:"",
      email:"",
      phoneNumber:"",
      gstin:"",
      stateCode:"",
    },
    {
      cName: "PASS PASS",
      cShort: "PASS",
      address:"",
      email:"",
      phoneNumber:"",
      gstin:"",
      stateCode:"",
    },
    {
      cName: "RAS OIL",
      cShort: "RAS",
      address:"",
      email:"",
      phoneNumber:"",
      gstin:"",
      stateCode:"",
    },
    {
      cName: "RICHEESE WAFER",
      cShort: "RICHE",
      address:"",
      email:"",
      phoneNumber:"",
      gstin:"",
      stateCode:"",
    },
    {
      cName: "TIGER BALM",
      cShort: "58697",
      address:"",
      email:"",
      phoneNumber:"",
      gstin:"",
      stateCode:"",
    },
    {
      cName: "UNITED FOODS",
      cShort: "UF",
      address:"",
      email:"",
      phoneNumber:"",
      gstin:"",
      stateCode:"",
    },
    {
      cName: "USHODAYA ENTERPRISES LTD",
      cShort: "PRIYA",
      address:"Survey No 100/3A , Ganapathy nagar main road , Vanagaram , Chennai , Pincode - 600095",
      email:"",
      phoneNumber:"",
      gstin:"33AAACU2690P3ZW",
      stateCode:"33",
    },
    {
      cName: "VIKAAS FOOD PRODUCTS",
      cShort: "JAM",
      address:"",
      email:"",
      phoneNumber:"",
      gstin:"",
      stateCode:"",
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
