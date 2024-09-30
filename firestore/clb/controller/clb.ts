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
import { AddCLBDTO, CLBDTO, addCLBSchema } from "../dto/clb";
import { db } from "../../../services/firebase";
import { Alert } from "react-native";

// Função para adicionar uma fazenda
async function addCLB(data: AddCLBDTO): Promise<boolean | string> {
  try {
    const validated = await addCLBSchema.validate(data);

    const docRef = await addDoc(collection(db, "CLB"), {
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
async function getCLBByFazendaId(fazendaId: string): Promise<CLBDTO[]> {
  if (!fazendaId) {
    console.error("Erro: fazendaId não definido");
    Alert.alert("Erro", "O ID da fazenda não foi definido.");
    return [];
  }

  try {
    const q = query(collection(db, "CLB"), where("fazendaId", "==", fazendaId));
    const querySnapshot = await getDocs(q);
    const CLB: CLBDTO[] = [];
    querySnapshot.forEach((doc) => {
      CLB.push({ id: doc.id, ...doc.data() } as CLBDTO);
    });
    return CLB;
  } catch (error) {
    console.error("Erro ao consultar registros da fazenda", error);
    Alert.alert("Erro ao consultar registros da fazenda");
    return [];
  }
}

// Função para obter uma fazenda pelo ID
async function getCLBById(id: string): Promise<CLBDTO> {
  try {
    const docRef = doc(db, "CLB", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as CLBDTO;
    } else {
      console.log("Registro não encontrado!");
      return {} as CLBDTO;
    }
  } catch (error) {
    console.error("Erro ao consultar registro", error);
    return {} as CLBDTO;
  }
}

async function deleteCLB(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "CLB", id));
    Alert.alert("Registro deletado com sucesso!");
    return true;
  } catch (error) {
    Alert.alert("Erro ao deletar CLB");
    console.error("Erro ao deletar registro", error);
    return false;
  }
}

export { addCLB, getCLBByFazendaId, getCLBById, deleteCLB };
