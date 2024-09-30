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
import { AddLBSDTO, LBSDTO, addLBSSchema } from "../dto/lbs";
import { db } from "../../../services/firebase";
import { Alert } from "react-native";

// Função para adicionar uma fazenda
async function addLBS(data: AddLBSDTO): Promise<boolean | string> {
  try {
    const validated = await addLBSSchema.validate(data);

    // Remover campos com valor undefined
    const cleanedData = Object.fromEntries(
      Object.entries(validated).filter(([_, v]) => v !== undefined)
    );

    const docRef = await addDoc(collection(db, "LBS"), {
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      ...cleanedData,
    });

    return docRef.id;
  } catch (error: any) {
    Alert.alert("Erro ao adicionar Licença", error.message);
    console.error("Erro ao adicionar Licença", error);
    return false;
  }
}

// Função para obter todas as fazendas
async function getLBSByFazendaId(fazendaId: string): Promise<LBSDTO[]> {
  try {
    const q = query(collection(db, "LBS"), where("fazendaId", "==", fazendaId));
    const querySnapshot = await getDocs(q);

    const LBS: LBSDTO[] = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as LBSDTO)
    );

    return LBS;
  } catch (error) {
    console.error("Erro ao consultar Licenças da fazenda", error);
    return [];
  }
}

// Função para obter uma fazenda pelo ID
async function getLBSById(id: string): Promise<LBSDTO> {
  try {
    const docRef = doc(db, "LBS", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as LBSDTO;
    } else {
      throw new Error("Documento não encontrado");
    }
  } catch (error) {
    console.error("Erro ao consultar Licença", error);
    return {} as LBSDTO;
  }
}

async function deleteLBS(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "LBS", id));
    Alert.alert("Licença deletada com sucesso!");
    return true;
  } catch (error) {
    Alert.alert("Erro ao deletar Licença");
    console.error("Erro ao deletar Licença", error);
    return false;
  }
}

export { addLBS, getLBSByFazendaId, getLBSById, deleteLBS };
