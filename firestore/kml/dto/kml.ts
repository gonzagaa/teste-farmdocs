import * as yup from "yup";

class KMLDTO {
  constructor(
    public id: string,
    public fileName: string,
    public vencimento: string,
    public registro: string,
    public processo: string,
    public fileURL: string,
    public creatorId: string,
    public createdAt: Date,
    public updatedAt: Date,
    public fazendaId: string
  ) {}
}

class AddKMLDTO {
  constructor(
    public fileName: string,
    public vencimento: string,
    public registro: string,
    public processo: string,
    public fileURL: string,
    public creatorId: string,
    public fazendaId: string
  ) {}
}

class UpdateKMLDTO {
  constructor(
    public id: string,
    public fileName: string,
    public vencimento: string,
    public registro: string,
    public processo: string,
    public fileURL: string,
    public creatorId: string,
    public fazendaId: string
  ) {}
}

const KMLSchema = yup.object().shape({
  fileName: yup.string().required(),
  fileURL: yup.string().required(),
  vencimento: yup.string(),
  registro: yup.string(),
  processo: yup.string(),
  creatorId: yup.string().required(),
  fazendaId: yup.string().required(),
});

const addKMLSchema = yup.object().shape({
  fileName: yup.string().required(),
  fileURL: yup.string().required(),
  vencimento: yup.string(),
  registro: yup.string(),
  processo: yup.string(),
  creatorId: yup.string().required(),
  fazendaId: yup.string().required(),
});

const updateKMLSchema = yup.object().shape({
  id: yup.string().required(),
  fileName: yup.string().required(),
  vencimento: yup.string(),
  registro: yup.string(),
  processo: yup.string(),
  fileURL: yup.string().required(),
  creatorId: yup.string().required(),
  fazendaId: yup.string().required(),
});

export {
  KMLDTO,
  AddKMLDTO,
  UpdateKMLDTO,
  KMLSchema,
  addKMLSchema,
  updateKMLSchema,
};
