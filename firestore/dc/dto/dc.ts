import * as yup from "yup";

class DCDTO {
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

class AddDCDTO {
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

class UpdateDCDTO {
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

const DCSchema = yup.object().shape({
  fileName: yup.string().required(),
  fileURL: yup.string().required(),
  vencimento: yup.string(),
  registro: yup.string(),
  processo: yup.string(),
  creatorId: yup.string().required(),
  fazendaId: yup.string().required(),
});

const addDCSchema = yup.object().shape({
  fileName: yup.string().required(),
  fileURL: yup.string().required(),
  vencimento: yup.string(),
  registro: yup.string(),
  processo: yup.string(),
  creatorId: yup.string().required(),
  fazendaId: yup.string().required(),
});

const updateDCSchema = yup.object().shape({
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
  DCDTO,
  AddDCDTO,
  UpdateDCDTO,
  DCSchema,
  addDCSchema,
  updateDCSchema,
};
