import {
  doc,
  setDoc,
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  AddEscalaDTO,
  AddPlantaoDTO,
  EscalaDTO,
  TimeBlock,
  UpdateEscalaDTO,
  addEscalaSchema,
  escalaSchema,
  plantaoSchema,
  updateEscalaSchema,
} from "../dto/escala.dto";
import { db } from "../../../services/firebase";
import { ValidationError } from "yup";

async function addEscala(data: AddEscalaDTO): Promise<string> {
  await escalaSchema
    .validate(
      {
        ...data,
        createdAt: new Date().toISOString(),
      },
      { abortEarly: false }
    )
    .then(() => {
      console.log("Validado");
    })
    .catch((e: ValidationError) => {
      if (e.errors) {
        e.errors.forEach((error) => {
          console.log(error);
        });
        throw new Error(e.errors.join(", "));
      }
    });

  const medicoRef = await addDoc(collection(db, "Escalas"), {
    ...data,
  }).catch((error) => {
    console.log(error);
    throw new Error(error);
  });

  return medicoRef.id;
}

async function addPlantao(data: AddPlantaoDTO): Promise<string> {
  await plantaoSchema
    .validate(
      {
        ...data,
        createdAt: new Date().toISOString(),
      },
      { abortEarly: false }
    )
    .then(() => {
      console.log("Validado");
    })
    .catch((e: ValidationError) => {
      if (e.errors) {
        e.errors.forEach((error) => {
          console.log(error);
        });
        throw new Error(e.errors.join(", "));
      }
    });

  const medicoRef = await addDoc(collection(db, "Plantoes"), {
    ...data,
  }).catch((error) => {
    console.log(error);
    throw new Error(error);
  });

  return medicoRef.id;
}

async function updateEscala(data: UpdateEscalaDTO): Promise<boolean> {
  await escalaSchema.validate(
    {
      ...data,
      updatedAt: new Date().toISOString(),
    },
    { abortEarly: false }
  );
  await setDoc(doc(db, "Escalas", data.id), data).catch((error) => {
    throw new Error(error);
  });
  return true;
}

async function deleteEscala(id: string): Promise<boolean> {
  await setDoc(doc(db, "Escalas", id), {
    deletedAt: new Date(),
  }).catch((error) => {
    throw new Error(error);
  });
  return true;
}

async function getEscalas(medicoId: string, dateISOString?: string) {
  try {
    const escalasRef = collection(db, "Escalas");
    const q = query(escalasRef, where("medicoId", "==", medicoId));

    const querySnapshot = await getDocs(q);
    const escalas = querySnapshot.docs.map((doc) => doc.data());

    if (dateISOString) {
      const filteredEscalas = escalas.filter((escala) =>
        escala.availableDates.some(
          (date: any) => date.split("T")[0] === dateISOString.split("T")[0]
        )
      );
      return filteredEscalas;
    }

    return escalas;
  } catch (error: any) {
    console.error("Erro ao buscar escalas: ", error);
    throw new Error(error.message);
  }
}

export {
  getEscalas,
  addEscala,
  addPlantao,
  updateEscala,
  deleteEscala,
  EscalaDTO,
  AddEscalaDTO,
  UpdateEscalaDTO,
  escalaSchema,
  addEscalaSchema,
  updateEscalaSchema,
};
