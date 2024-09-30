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
import { AddOUADTO, OUADTO, addOUASchema } from "../dto/oua";
import { db } from "../../../services/firebase";
import { Alert } from "react-native";

// Função para adicionar uma fazenda
async function addOUA(data: AddOUADTO): Promise<boolean | string> {
  try {
    const validated = await addOUASchema.validate(data);

    const docRef = await addDoc(collection(db, "OUA"), {
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
async function getOUAByFazendaId(fazendaId: string): Promise<OUADTO[]> {
  try {
    const q = query(collection(db, "OUA"), where("fazendaId", "==", fazendaId));
    const querySnapshot = await getDocs(q);
    const OUA: OUADTO[] = [];
    querySnapshot.forEach((doc) => {
      OUA.push({ id: doc.id, ...doc.data() } as OUADTO);
    });
    return OUA;
  } catch (error) {
    console.error("Erro ao consultar registros da fazenda", error);
    return [];
  }
}

// Função para obter uma fazenda pelo ID
async function getOUAById(id: string): Promise<OUADTO> {
  try {
    const docRef = doc(db, "OUA", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as OUADTO;
    } else {
      console.log("Registro não encontrado!");
      return {} as OUADTO;
    }
  } catch (error) {
    console.error("Erro ao consultar registro", error);
    return {} as OUADTO;
  }
}

async function deleteOUA(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "OUA", id));
    Alert.alert("Registro deletado com sucesso!");
    return true;
  } catch (error) {
    Alert.alert("Erro ao deletar OUA");
    console.error("Erro ao deletar registro", error);
    return false;
  }
}

export { addOUA, getOUAByFazendaId, getOUAById, deleteOUA };
