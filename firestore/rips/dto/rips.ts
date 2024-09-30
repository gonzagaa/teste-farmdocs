import * as yup from "yup";

class RIPSDTO {
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

class AddRIPSDTO {
  constructor(
    public fileName: string,
    public fileURL: string,
    public vencimento: string,
    public registro: string,
    public processo: string,
    public creatorId: string,
    public fazendaId: string,
    public notify_at: string
  ) {}
}

class UpdateRIPSDTO {
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

const ripsSchema = yup.object().shape({
  fileName: yup.string().required(),
  fileURL: yup.string().required(),
  vencimento: yup.string(),
  registro: yup.string(),
  processo: yup.string(),
  creatorId: yup.string().required(),
  fazendaId: yup.string().required(),
});

const addRIPSSchema = yup.object().shape({
  fileName: yup.string().required(),
  fileURL: yup.string().required(),
  vencimento: yup.string(),
  registro: yup.string(),
  processo: yup.string(),
  creatorId: yup.string().required(),
  fazendaId: yup.string().required(),
});

const updateRIPSSchema = yup.object().shape({
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
  RIPSDTO,
  AddRIPSDTO,
  UpdateRIPSDTO,
  ripsSchema,
  addRIPSSchema,
  updateRIPSSchema,
};
