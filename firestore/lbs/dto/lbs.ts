import * as yup from "yup";

class LBSDTO {
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

class AddLBSDTO {
  constructor(
    public fileName: string,
    public vencimento: string,
    public registro: string,
    public processo: string,
    public fileURL: string,
    public creatorId: string,
    public fazendaId: string,
    public notify_at: string
  ) {}
}

class UpdateLBSDTO {
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

const LBSSchema = yup.object().shape({
  fileName: yup.string().required(),
  fileURL: yup.string().required(),
  vencimento: yup.string(),
  registro: yup.string(),
  processo: yup.string(),
  creatorId: yup.string().required(),
  fazendaId: yup.string().required(),
});

const addLBSSchema = yup.object().shape({
  fileName: yup.string().required(),
  fileURL: yup.string().required(),
  vencimento: yup.string(),
  registro: yup.string(),
  processo: yup.string(),
  creatorId: yup.string().required(),
  fazendaId: yup.string().required(),
});

const updateLBSSchema = yup.object().shape({
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
  LBSDTO,
  AddLBSDTO,
  UpdateLBSDTO,
  LBSSchema,
  addLBSSchema,
  updateLBSSchema,
};
