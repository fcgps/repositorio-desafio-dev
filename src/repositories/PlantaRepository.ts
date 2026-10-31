import { Prisma } from "@prisma/client";
import prisma from "@database";


export const createPlanta = async (data: Prisma.PlantaCreateInput) => {
    return await prisma.planta.create({
        data: data,
    });
};

export const findAllPlantas = async (where: Prisma.PlantaWhereInput = {}) => {
    return await prisma.planta.findMany({
        where: where,
    });
};

export const findPlantaById = async (id: number) => {
    return await prisma.planta.findUnique({
        where: { id: id }
    });
};

export const updatePlanta = async (id: number, data: Prisma.PlantaUpdateInput) => {
    return await prisma.planta.update({
        where: { id: id },
        data: data,
    });
};

export const deletePlanta = async (id: number) => {
    return await prisma.planta.delete({
        where: { id: id }
    });
};

// Vender planta
export const sellPlanta = async (id: number, quantidade: number) => {
  return await prisma.planta.updateMany({
    where: { id: id , estoque: { gte: quantidade } },
    data: { estoque: { decrement: quantidade } },
  });
};

export const findPrecoEEstoqueDasPlantas = async () => {
  return await prisma.planta.findMany({
    select: { preco: true, estoque: true },
  });
};

export const findPlantasEsgotadas = async () => {
  return await prisma.planta.findMany({
    where: { estoque: 0 },
  });
};