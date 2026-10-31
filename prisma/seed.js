const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const plantas = [
  { nome: "Costela-de-adão", especie: "Monstera deliciosa", preco: 8990, estoque: 12, luminosidade: "MEIA_SOMBRA", petFriendly: false, regaACadaDias: 3 },
  { nome: "Samambaia", especie: "Nephrolepis exaltata", preco: 4500, estoque: 5, luminosidade: "MEIA_SOMBRA", petFriendly: true, regaACadaDias: 2 },
  { nome: "Cacto-bola", especie: "Echinocactus grusonii", preco: 3000, estoque: 0, luminosidade: "SOL_PLENO", petFriendly: true, regaACadaDias: 14 },
  { nome: "Espada-de-são-jorge", especie: "Dracaena trifasciata", preco: 2500, estoque: 8, luminosidade: "SOMBRA", petFriendly: false, regaACadaDias: 10 },
  { nome: "Jiboia", especie: "Epipremnum aureum", preco: 1500, estoque: 10, luminosidade: "SOMBRA", petFriendly: false, regaACadaDias: 7 },
];

async function main() {
  const total = await prisma.planta.count();

  if (total > 0) {
    console.log(`O banco já tem ${total} planta(s). Seed ignorado.`);
    return;
  }

  await prisma.planta.createMany({ data: plantas });
  console.log(`${plantas.length} plantas cadastradas.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });