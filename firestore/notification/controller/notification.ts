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
import {
  NotificationDTO,
  ADDNotificationDTO,
  NotificationSchema,
  UpdateNotificationDTO,
  addNotificationSchema,
  updateNotificationSchema,
} from "../dto/notification";
import { db } from "../../../services/firebase";
import { Alert } from "react-native";

// Função para adicionar uma fazenda
async function addNotification(
  data: ADDNotificationDTO
): Promise<boolean | string> {
  try {
    const validated = await addNotificationSchema.validate(data);

    const docRef = await addDoc(collection(db, "Notification"), {
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      ...validated,
    });

    console.log("Notificação registrada com sucesso!");
    return docRef.id;
  } catch (error: any) {
    Alert.alert("Erro ao adicionar Declaração", error.message);
    console.error("Erro ao adicionar Declaração", error);
    return false;
  }
}

async function getNotificationsByCreatorId(
  creatorId: string
): Promise<NotificationDTO[]> {
  try {
    const q = query(
      collection(db, "Notification"),
      where("creatorId", "==", creatorId)
    );
    const querySnapshot = await getDocs(q);
    const Notification: NotificationDTO[] = [];
    querySnapshot.forEach((doc) => {
      Notification.push({ id: doc.id, ...doc.data() } as NotificationDTO);
    });
    return Notification;
  } catch (error) {
    console.log("Erro ao consultar Declaraçãos do usuário", error);
    return [];
  }
}

// Função para obter todas as fazendas
async function getNotificationByFazendaId(
  fazendaId: string
): Promise<NotificationDTO[]> {
  try {
    const q = query(
      collection(db, "Notification"),
      where("fazendaId", "==", fazendaId)
    );
    const querySnapshot = await getDocs(q);
    const Notification: NotificationDTO[] = [];
    querySnapshot.forEach((doc) => {
      Notification.push({ id: doc.id, ...doc.data() } as NotificationDTO);
    });
    return Notification;
  } catch (error) {
    console.error("Erro ao consultar Declaraçãos da fazenda", error);
    return [];
  }
}

// Função para obter uma fazenda pelo ID
async function getNotificationById(id: string): Promise<NotificationDTO> {
  try {
    const docRef = doc(db, "Notification", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as NotificationDTO;
    } else {
      console.log("Declaração não encontrado!");
      return {} as NotificationDTO;
    }
  } catch (error) {
    console.error("Erro ao consultar Declaração", error);
    return {} as NotificationDTO;
  }
}

async function deleteNotification(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "Notification", id));
    Alert.alert("Notificação deletada com sucesso!");
    return true;
  } catch (error) {
    Alert.alert("Erro ao deletar notificação");
    console.error("Erro ao deletar notificação", error);
    return false;
  }
}

export {
  addNotification,
  getNotificationByFazendaId,
  getNotificationsByCreatorId,
  getNotificationById,
  deleteNotification,
};
