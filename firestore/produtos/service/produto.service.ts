import {
  doc,
  setDoc,
  addDoc,
  collection,
  getDocs,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  AddProdutoDTO,
  UpdateProdutoDTO,
  produtoSchema,
} from "../dto/produtos.dto";
import { db } from "../../../services/firebase";
import { ValidationError } from "yup";

async function addProduto(data: AddProdutoDTO): Promise<string> {
  console.log(data);
  await produtoSchema
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
          console.log(error)
        });
        throw new Error(e.errors.join(", "));
      }
    });

  const medicoRef = await addDoc(collection(db, "Produtos"), {
    ...data,
  }).catch((error) => {
    console.log(error);
    throw new Error(error);
  });

  return medicoRef.id;
}

async function updateProduto(data: UpdateProdutoDTO): Promise<boolean> {
  await produtoSchema.validate(
    {
      ...data,
      updatedAt: new Date().toISOString(),
    },
    { abortEarly: false }
  );
  await setDoc(doc(db, "Produtos", data.id), data).catch((error) => {
    throw new Error(error);
  });
  return true;
}

async function deleteProduto(id: string): Promise<boolean> {
  await deleteDoc(doc(db, "Produtos", id)).catch((error) => {
    throw new Error(error);
  });

  return true;
}

async function getProdutos() {
  try {
    const medicosCollection = collection(db, "Produtos");
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

async function getProduto(id: string) {
  const medicoRef = doc(db, "Produtos", id);
  const medicoSnapshot = await getDoc(medicoRef);

  if (!medicoSnapshot.exists()) {
    throw new Error("Produto não encontrado");
  }

  return {
    id: medicoSnapshot.id,
    ...medicoSnapshot.data(),
  };
}

export { addProduto, updateProduto, deleteProduto, getProdutos, getProduto };
