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
import { ALSVLSVDTO, LSVDTO, aLSVLSVSchema } from "../dto/lsv";
import { db } from "../../../services/firebase";
import { Alert } from "react-native";

// Função para adicionar uma fazenda
async function addLSV(data: ALSVLSVDTO): Promise<boolean | string> {
  try {
    const validated = await aLSVLSVSchema.validate(data);

    // Remover campos com valor undefined
    const cleanedData = Object.fromEntries(
      Object.entries(validated).filter(([_, v]) => v !== undefined)
    );

    const docRef = await addDoc(collection(db, "LSV"), {
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
async function getLSVByFazendaId(fazendaId: string): Promise<LSVDTO[]> {
  try {
    const q = query(collection(db, "LSV"), where("fazendaId", "==", fazendaId));
    const querySnapshot = await getDocs(q);

    const LSV: LSVDTO[] = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as LSVDTO)
    );

    return LSV;
  } catch (error) {
    console.error("Erro ao consultar Licenças da fazenda", error);
    return [];
  }
}

// Função para obter uma fazenda pelo ID
async function getLSVById(id: string): Promise<LSVDTO> {
  try {
    const docRef = doc(db, "LSV", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as LSVDTO;
    } else {
      console.log("Licença não encontrada!");
      return {} as LSVDTO;
    }
  } catch (error) {
    console.error("Erro ao consultar Licença", error);
    return {} as LSVDTO;
  }
}

async function deleteLSV(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "LSV", id));
    Alert.alert("Licença deletada com sucesso!");
    return true;
  } catch (error) {
    Alert.alert("Erro ao deletar Licença");
    console.error("Erro ao deletar Licença", error);
    return false;
  }
}

export { addLSV, getLSVByFazendaId, getLSVById, deleteLSV };
