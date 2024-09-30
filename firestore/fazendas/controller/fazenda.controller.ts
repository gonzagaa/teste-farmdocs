import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import {
  AddFazendaDTO,
  FazendaDTO,
  UpdateFazendaDTO,
  addFazendaSchema,
} from "../dto/fazendas.dto";
import { db } from "../../../services/firebase";
import { v4 as uuidv4 } from "uuid";

async function addFazenda(data: AddFazendaDTO): Promise<boolean | string> {
  try {
    const id = uuidv4(); // Gerar ID único no lado do cliente

    const validated = await addFazendaSchema.validate(data);

    await setDoc(
      doc(db, "fazendas", id),
      {
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        id,
        ...validated,
      },
      { merge: true }
    );

    window.alert("Fazenda adicionada com sucesso!"); // Substitui o Alert do React Native
    return id;
  } catch (error: any) {
    window.alert("Error adding document: " + error.message); // Substitui o Alert do React Native
    console.error("Error adding document: ", error);
    return false;
  }
}

async function updateFazenda(data: UpdateFazendaDTO): Promise<boolean> {
  try {
    const validated = await addFazendaSchema.validate(data);

    const docRef = doc(db, "fazendas", data.id);

    await setDoc(docRef, validated, { merge: true });

    window.alert("Fazenda atualizada com sucesso!"); // Substitui o Alert do React Native

    return true;
  } catch (error: any) {
    window.alert("Error updating document: " + error.message); // Substitui o Alert do React Native
    console.error("Error updating document: ", error);
    return false;
  }
}

// Função para obter todas as fazendas
async function getFazendaByUserId(userId: string): Promise<FazendaDTO[]> {
  try {
    const fazendas: FazendaDTO[] = [];
    const q = query(collection(db, "fazendas"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const fazenda = doc.data() as FazendaDTO;
      if (fazenda.creatorId === userId) {
        fazendas.push(fazenda as FazendaDTO);
      }
    });

    return fazendas;
  } catch (error) {
    console.error("Error getting fazendas: ", error);
    return [];
  }
}

// Função para obter uma fazenda pelo ID
async function getFazendaById(id: string): Promise<FazendaDTO> {
  try {
    const docRef = doc(db, "fazendas", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as FazendaDTO;
    } else {
      console.log("No such document!");
      return {} as FazendaDTO;
    }
  } catch (error) {
    console.error("Error getting fazenda by ID: ", error);
    return {} as FazendaDTO;
  }
}

async function deleteFazenda(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "fazendas", id));
    window.alert("Fazenda deletada com sucesso!"); // Substitui o Alert do React Native
    return true;
  } catch (error: any) {
    window.alert("Erro ao deletar fazenda: " + error.message); // Substitui o Alert do React Native
    console.error("Error deleting fazenda: ", error);
    return false;
  }
}

export {
  addFazenda,
  updateFazenda,
  getFazendaByUserId,
  getFazendaById,
  deleteFazenda,
};
