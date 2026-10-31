import { Request, Response } from "express";
import { Luminosidade } from "@prisma/client";
import * as PlantaRepository from "@repositories/PlantaRepository";

// O controller recebe a requisição, valida os dados, chama o repository
// e decide qual status HTTP e qual corpo devolver.

export const createPlanta = async (req: Request, res: Response) => {
  try {
    const { nome, especie, preco, estoque, luminosidade, petFriendly, regaACadaDias }= req.body;

    // 400 Bad Request: o cliente mandou dados incompletos
    if ( nome === undefined || especie === undefined || preco === undefined || estoque === undefined || luminosidade === undefined || petFriendly === undefined || regaACadaDias === undefined) {
        return res.status(400).json({
        message: "Preencha todos os campos (nome, especie, preco, estoque, luminosidade, petFriendly e regaACadaDias).",
      });
    }

    if (!(typeof nome === "string" && nome.trim() !== "")){
        return res.status(400).json({
        message: "O nome deve ser um texto não vazio.",
      });
    }

    if (!(typeof especie === "string" && especie.trim() !== "")){
        return res.status(400).json({
        message: "A espécie deve ser um texto não vazio.",
      });
    }

    if (!(Number.isInteger(preco) && preco > 0)){
        return res.status(400).json({
        message: "O preço deve ser um inteiro maior que 0.",
      });
    }

    if (!(Number.isInteger(estoque) && estoque >= 0)){
        return res.status(400).json({
        message: "O estoque deve ser um inteiro maior ou igual a 0.",
      });
    }

    if (!(Object.values(Luminosidade).includes(luminosidade))){
        return res.status(400).json({
        message: "A luminosidade deve ser SOMBRA, MEIA_SOMBRA ou SOL_PLENO.",
      });
    }

    if (!(typeof petFriendly === "boolean")){
        return res.status(400).json({
        message: "O campo petFriendly deve ser um booleano.",
      });
    }

    if (!(Number.isInteger(regaACadaDias) && regaACadaDias >= 1)){
        return res.status(400).json({
        message: "O campo regaACadaDias deve ser um inteiro maior ou igual a 1.",
      });
    }
    
    const planta = await PlantaRepository.createPlanta({
        nome: nome,
        especie: especie,
        preco: preco,
        estoque: estoque,
        luminosidade: luminosidade,
        petFriendly: petFriendly,
        regaACadaDias: regaACadaDias,
    });

    return res.status(201).json(planta);

  } catch (error) {
    console.error(error);
    // 500 Internal Server Error: o problema foi nosso, não do cliente
    return res.status(500).json({ message: "Erro ao criar planta."});
  }
};

export const readAllPlantas = async (req: Request, res: Response) => {
  try {
    const { luminosidade, petFriendly } = req.query;

    // 400 se a luminosidade foi enviada e não é um valor do enum
    if (luminosidade !== undefined && !Object.values(Luminosidade).includes(luminosidade as Luminosidade)) {
        return res.status(400).json({message: "A luminosidade deve ser SOMBRA, MEIA_SOMBRA ou SOL_PLENO.",});
    }

     // 400 se o petFriendly foi enviado e não é "true" nem "false"
    if (petFriendly !== undefined && petFriendly !== "true" && petFriendly !== "false") {
        return res.status(400).json({message: "O filtro petFriendly deve ser true ou false.",});
    }

    // petFriendly de texto para boolean, deixa undefined se o filtro não foi enviado
    let petFriendlyFiltro: boolean | undefined = undefined;
    if (petFriendly !== undefined) {
      petFriendlyFiltro = petFriendly === "true";
    }

    
    const plantas = await PlantaRepository.findAllPlantas({
        luminosidade: luminosidade as Luminosidade | undefined,
        petFriendly: petFriendlyFiltro,
        });
    

    return res.status(200).json(plantas);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar plantas." });
  }
};

export const readPlantaById = async (req: Request, res: Response) => {
  try {
    // O id chega da URL como texto, então convertemos para número
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message : "O id deve ser um inteiro maior ou igual a 1."});
    }

    const planta = await PlantaRepository.findPlantaById(id);

    // 404 Not Found: o id não existe
    if (!planta) {
      return res.status(404).json({ message: "Planta não encontrada." });
    }

    return res.status(200).json(planta);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar planta." });
  }
};

export const updatePlanta = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message : "O id deve ser um inteiro maior ou igual a 1."});
    }

     const planta = await PlantaRepository.findPlantaById(id);

    if (!planta) {
      return res.status(404).json({ message: "Planta não encontrada." });
    }

    const { nome, especie, preco, estoque, luminosidade, petFriendly, regaACadaDias }= req.body;

    if (nome !== undefined && !(typeof nome === "string" && nome.trim() !== "")) {
        return res.status(400).json({ message: "O nome deve ser um texto não vazio." });
    }

    if (especie !== undefined && !(typeof especie === "string" && especie.trim() !== "")) {
        return res.status(400).json({ message: "A espécie deve ser um texto não vazio." });
    }

    if (preco !== undefined && !(Number.isInteger(preco) && preco > 0)) {
        return res.status(400).json({ message: "O preço deve ser um inteiro maior que 0." });
    }

    if (estoque !== undefined && !(Number.isInteger(estoque) && estoque >= 0)) {
        return res.status(400).json({message: "O estoque deve ser um inteiro maior ou igual a 0.",});
    }

    if (luminosidade !== undefined && !Object.values(Luminosidade).includes(luminosidade)) {
        return res.status(400).json({ message: "A luminosidade deve ser SOMBRA, MEIA_SOMBRA ou SOL_PLENO.",});
    }

    if (petFriendly !== undefined && typeof petFriendly !== "boolean") {
        return res.status(400).json({message: "O campo petFriendly deve ser um booleano.",});
    }

    if (regaACadaDias !== undefined && !(Number.isInteger(regaACadaDias) && regaACadaDias >= 1)) {
        return res.status(400).json({message: "O campo regaACadaDias deve ser um inteiro maior ou igual a 1.",});
    }

    // PATCH = atualização parcial: campos não enviados (undefined) não são alterados
    const updatedPlanta = await PlantaRepository.updatePlanta(id, {
        nome: nome,
        especie: especie,
        preco: preco,
        estoque: estoque,
        luminosidade: luminosidade,
        petFriendly: petFriendly,
        regaACadaDias: regaACadaDias,
    });

    return res.status(200).json(updatedPlanta);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao atualizar planta." });
  }
};

export const deletePlanta = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message : "O id deve ser um inteiro maior ou igual a 1."});
    }

    const planta = await PlantaRepository.findPlantaById(id);

    if (!planta) {
      return res.status(404).json({ message: "Planta não encontrada." });
    }

    await PlantaRepository.deletePlanta(id);

    // 204 No Content: deu certo e não há nada para devolver
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao deletar planta." });
  }
};


export const sellPlanta = async (req: Request, res: Response) => {
    try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "O id deve ser um inteiro maior ou igual a 1." });
    }

    const { quantidade } = req.body;
    if (!(Number.isInteger(quantidade) && quantidade > 0)) {
      return res.status(400).json({ message: "A quantidade precisa ser um inteiro maior que 0." });
    }

    const planta = await PlantaRepository.findPlantaById(id);
    if (!planta) {
      return res.status(404).json({ message: "Planta não encontrada." });
    }

    if (planta.estoque < quantidade) {
      return res.status(400).json({ message: `Temos só ${planta.estoque} vasos.` });
    }

    const plantaAtualizada = await PlantaRepository.sellPlanta(id, quantidade);

    return res.status(200).json(plantaAtualizada);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao realizar venda." });
  }
};


export const readValorTotalEstoque = async (req: Request, res: Response) => {
  try {
    const plantas = await PlantaRepository.findPrecoEEstoqueDasPlantas();

    let valorTotalEmCentavos = 0;
    let totalDeVasos = 0;

    for (const planta of plantas){
        valorTotalEmCentavos += planta.preco * planta.estoque;
        totalDeVasos += planta.estoque;
    }

    return res.status(200).json({ valorTotalEmCentavos, totalDeVasos });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao calcular o valor total do estoque." });
  }
};

