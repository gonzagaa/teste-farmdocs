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
import { AddDDDTO, DDDTO, addDDSchema } from "../dto/dd";
import { db } from "../../../services/firebase";
import { Alert } from "react-native";

// Função para adicionar uma fazenda
async function addDD(data: AddDDDTO): Promise<boolean | string> {
  try {
    const validated = await addDDSchema.validate(data);

    const docRef = await addDoc(collection(db, "DD"), {
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      ...validated,
    });

    Alert.alert("Declaração adicionado com sucesso!");
    return docRef.id;
  } catch (error: any) {
    Alert.alert("Erro ao adicionar Declaração", error.message);
    console.error("Erro ao adicionar Declaração", error);
    return false;
  }
}

// Função para obter todas as fazendas
async function getDDByFazendaId(fazendaId: string): Promise<DDDTO[]> {
  try {
    const q = query(collection(db, "DD"), where("fazendaId", "==", fazendaId));
    const querySnapshot = await getDocs(q);
    const DD: DDDTO[] = [];
    querySnapshot.forEach((doc) => {
      DD.push({ id: doc.id, ...doc.data() } as DDDTO);
    });
    return DD;
  } catch (error) {
    console.error("Erro ao consultar Declaraçãos da fazenda", error);
    return [];
  }
}

// Função para obter uma fazenda pelo ID
async function getDDById(id: string): Promise<DDDTO> {
  try {
    const docRef = doc(db, "DD", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as DDDTO;
    } else {
      console.log("Declaração não encontrado!");
      return {} as DDDTO;
    }
  } catch (error) {
    console.error("Erro ao consultar Declaração", error);
    return {} as DDDTO;
  }
}

async function deleteDD(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "DD", id));
    Alert.alert("Declaração deletado com sucesso!");
    return true;
  } catch (error) {
    Alert.alert("Erro ao deletar DD");
    console.error("Erro ao deletar Declaração", error);
    return false;
  }
}

export { addDD, getDDByFazendaId, getDDById, deleteDD };
