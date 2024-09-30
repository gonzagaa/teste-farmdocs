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
import { AddRIPSDTO, RIPSDTO, addRIPSSchema } from "../dto/rips";
import { db } from "../../../services/firebase";
import { Alert } from "react-native";

// Função para adicionar uma fazenda
async function addRIPS(data: AddRIPSDTO): Promise<boolean | string> {
  try {
    const validated = await addRIPSSchema.validate(data);

    const docRef = await addDoc(collection(db, "RIPS"), {
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      ...validated,
    });

    return docRef.id;
  } catch (error: any) {
    Alert.alert("Erro ao adicionar registro", error.message);
    console.error("Erro ao adicionar registro", error);
    return false;
  }
}

// Função para obter todas as fazendas
async function getRIPSByFazendaId(fazendaId: string): Promise<RIPSDTO[]> {
  try {
    const q = query(
      collection(db, "RIPS"),
      where("fazendaId", "==", fazendaId)
    );
    const querySnapshot = await getDocs(q);
    const rips: RIPSDTO[] = [];
    querySnapshot.forEach((doc) => {
      rips.push({ id: doc.id, ...doc.data() } as RIPSDTO);
    });
    return rips;
  } catch (error) {
    console.error("Erro ao consultar registros da fazenda", error);
    return [];
  }
}

// Função para obter uma fazenda pelo ID
async function getRIPSById(id: string): Promise<RIPSDTO> {
  try {
    const docRef = doc(db, "RIPS", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as RIPSDTO;
    } else {
      console.log("Registro não encontrado!");
      return {} as RIPSDTO;
    }
  } catch (error) {
    console.error("Erro ao consultar registro", error);
    return {} as RIPSDTO;
  }
}

async function deleteRIPS(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "RIPS", id));
    Alert.alert("Registro deletado com sucesso!");
    return true;
  } catch (error) {
    Alert.alert("Erro ao deletar registro");
    console.error("Erro ao deletar registro", error);
    return false;
  }
}

export { addRIPS, getRIPSByFazendaId, getRIPSById, deleteRIPS };
