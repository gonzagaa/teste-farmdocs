import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { AddDCDTO, DCDTO, addDCSchema } from "../dto/dc";
import { db } from "../../../services/firebase";
import { Alert } from "react-native";

// Função para adicionar uma fazenda
async function addDC(data: AddDCDTO): Promise<boolean | string> {
  try {
    const validated = await addDCSchema.validate(data);

    // Remover campos com valor undefined
    const cleanedData = Object.fromEntries(
      Object.entries(validated).filter(([_, v]) => v !== undefined)
    );

    const docRef = await addDoc(collection(db, "DC"), {
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      ...cleanedData,
    });

    Alert.alert("Documento adicionado com sucesso!");
    return docRef.id;
  } catch (error: any) {
    Alert.alert("Erro ao adicionar Documento", error.message);
    console.error("Erro ao adicionar Documento", error);
    return false;
  }
}

// Função para obter todas as fazendas
async function getDCByFazendaId(fazendaId: string): Promise<DCDTO[]> {
  try {
    const q = query(collection(db, "DC"), where("fazendaId", "==", fazendaId));
    const querySnapshot = await getDocs(q);

    const DC: DCDTO[] = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as DCDTO)
    );

    return DC;
  } catch (error) {
    console.error("Erro ao consultar documentos da fazenda", error);
    return [];
  }
}

// Função para obter uma fazenda pelo ID
async function getDCById(id: string): Promise<DCDTO> {
  try {
    const docRef = doc(db, "DC", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as DCDTO;
    } else {
      throw new Error("Documento não encontrado");
    }
  } catch (error) {
    console.error("Erro ao consultar documento", error);
    return {} as DCDTO;
  }
}

async function deleteDC(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "DC", id));
    Alert.alert("Documento deletado com sucesso!");
    return true;
  } catch (error) {
    Alert.alert("Erro ao deletar documento");
    console.error("Erro ao deletar documento", error);
    return false;
  }
}

export { addDC, getDCByFazendaId, getDCById, deleteDC };
