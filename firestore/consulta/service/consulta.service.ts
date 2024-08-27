import {
  doc,
  setDoc,
  addDoc,
  collection,
  getDocs,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  AddConsultaDTO,
  ConsultaDTO,
  UpdateConsultaDTO,
  addConsultaSchema,
} from "../dto/consulta.dto";
import { db } from "../../../services/firebase";
import { ValidationError } from "yup";

const generateRandomId = () => {
  const characters = "abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < 7; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
};

async function addConsulta(data: AddConsultaDTO): Promise<string> {
  try {
    await addConsultaSchema.validate(
      {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { abortEarly: false }
    );

    const roomId = generateRandomId();

    const consultaRef = await addDoc(collection(db, "Consultas"), {
      ...data,
      roomId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return consultaRef.id;
  } catch (e: any) {
    if (e instanceof ValidationError && e.errors) {
      e.errors.forEach((error) => {
        console.log(error);
      });
      throw new Error(e.errors.join(", "));
    } else {
      console.log(e);
      throw new Error(e.message);
    }
  }
}

// Função para atualizar uma consulta existente
async function updateConsulta(data: UpdateConsultaDTO): Promise<boolean> {
  try {
    await addConsultaSchema.validate(
      {
        ...data,
        updatedAt: new Date().toISOString(),
      },
      { abortEarly: false }
    );

    await setDoc(doc(db, "Consultas", data.id), data);

    return true;
  } catch (e: any) {
    if (e instanceof ValidationError && e.errors) {
      e.errors.forEach((error) => {
        console.log(error);
      });
      throw new Error(e.errors.join(", "));
    } else {
      console.log(e);
      throw new Error(e.message);
    }
  }
}

// Função para deletar uma consulta
async function deleteConsulta(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "Consultas", id));
    return true;
  } catch (e: any) {
    console.log(e);
    throw new Error(e.message);
  }
}

// Função para buscar consultas por patientId
async function getConsultasByCustomerId(patientId: string) {
  try {
    const consultas: ConsultaDTO[] = [];
    const consultasSnapshot = await getDocs(collection(db, "Consultas"));

    consultasSnapshot.forEach((doc) => {
      const consulta = doc.data() as ConsultaDTO;
      if (consulta.patientId === patientId) {
        consultas.push(consulta);
      }
    });

    return consultas;
  } catch (error: any) {
    console.error("Erro ao buscar consultas: ", error);
    throw new Error(error.message);
  }
}

// Função para buscar consultas por medicoId
async function getConsultasByMedicoId(medicoId: string) {
  try {
    const consultas: ConsultaDTO[] = [];
    const consultasSnapshot = await getDocs(collection(db, "Consultas"));

    consultasSnapshot.forEach((doc) => {
      const consulta = doc.data() as ConsultaDTO;
      if (consulta.medicoId === medicoId) {
        consultas.push(consulta);
      }
    });

    return consultas;
  } catch (error: any) {
    console.error("Erro ao buscar consultas: ", error);
    throw new Error(error.message);
  }
}

// Função para buscar um produto por ID
async function getProduto(id: string) {
  try {
    const produtoRef = doc(db, "Produtos", id);
    const produtoSnapshot = await getDoc(produtoRef);

    if (!produtoSnapshot.exists()) {
      throw new Error("Produto não encontrado");
    }

    return {
      id: produtoSnapshot.id,
      ...produtoSnapshot.data(),
    };
  } catch (e: any) {
    console.log(e);
    throw new Error(e.message);
  }
}

export {
  addConsulta,
  updateConsulta,
  deleteConsulta,
  getConsultasByCustomerId,
  getConsultasByMedicoId,
  getProduto,
};
