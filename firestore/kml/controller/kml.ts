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
import { AddKMLDTO, KMLDTO, addKMLSchema } from "../dto/kml";
import { db } from "../../../services/firebase";
import { Alert } from "react-native";

// Função para adicionar uma fazenda
async function addKML(data: AddKMLDTO): Promise<boolean | string> {
  try {
    const validated = await addKMLSchema.validate(data);

    const docRef = await addDoc(collection(db, "KML"), {
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      ...validated,
    });

    Alert.alert("KML adicionado com sucesso!");
    return docRef.id;
  } catch (error: any) {
    Alert.alert("Erro ao adicionar KML", error.message);
    console.error("Erro ao adicionar KML", error);
    return false;
  }
}

// Função para obter todas as fazendas
async function getKMLByFazendaId(fazendaId: string): Promise<KMLDTO[]> {
  try {
    const q = query(collection(db, "KML"));

    const querySnapshot = await getDocs(q);

    const KML: KMLDTO[] = [];

    querySnapshot.forEach((doc) => {
      if (doc.data().fazendaId === fazendaId) {
        KML.push({ id: doc.id, ...doc.data() } as KMLDTO);
      }
    });

    return KML;
  } catch (error) {
    console.log(error);
    console.error("Erro ao consultar KMLs da fazenda", error);
    return [];
  }
}

// Função para obter uma fazenda pelo ID
async function getKMLById(id: string): Promise<KMLDTO> {
  try {
    const docRef = doc(db, "KML", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as KMLDTO;
    } else {
      console.log("KML não encontrado!");
      return {} as KMLDTO;
    }
  } catch (error) {
    console.error("Erro ao consultar KML", error);
    return {} as KMLDTO;
  }
}

async function deleteKML(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "KML", id));
    Alert.alert("KML deletado com sucesso!");
    return true;
  } catch (error) {
    Alert.alert("Erro ao deletar KML");
    console.error("Erro ao deletar KML", error);
    return false;
  }
}

export { addKML, getKMLByFazendaId, getKMLById, deleteKML };
