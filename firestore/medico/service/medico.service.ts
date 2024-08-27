import { doc, setDoc, addDoc, collection, getDocs } from "firebase/firestore";
import { AddMedicoDTO, UpdateMedicoDTO, medicoSchema } from "../dto/medico.dto";
import { db } from "../../../services/firebase";
import { ValidationError } from "yup";

async function addMedico(data: AddMedicoDTO): Promise<string> {
  console.log(data);
  await medicoSchema
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

  const medicoRef = await addDoc(collection(db, "Medicos"), {
    ...data,
  }).catch((error) => {
    console.log(error);
    throw new Error(error);
  });

  return medicoRef.id;
}

async function updateMedico(data: UpdateMedicoDTO): Promise<boolean> {
  await medicoSchema.validate(
    {
      ...data,
      updatedAt: new Date().toISOString(),
    },
    { abortEarly: false }
  );
  await setDoc(doc(db, "Medicos", data.id), data).catch((error) => {
    throw new Error(error);
  });
  return true;
}

async function deleteMedico(id: string): Promise<boolean> {
  await setDoc(doc(db, "Medicos", id), {
    deletedAt: new Date(),
  }).catch((error) => {
    throw new Error(error);
  });
  return true;
}

async function getMedicos() {
  try {
    const medicosCollection = collection(db, "Medicos");
    const medicoSnapshot = await getDocs(medicosCollection);
    const medicoList = medicoSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return medicoList;
  } catch (error: any) {
    console.error("Erro ao buscar médicos: ", error);
    throw new Error(error.message);
  }
}

export { addMedico, updateMedico, deleteMedico, getMedicos };
