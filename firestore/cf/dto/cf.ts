import * as yup from "yup";

class CFDTO {
  constructor(
    public id: string,
    public fazendaId: string,
    public fileName: string,
    public fileURL: string,
    public vencimento: string,
    public notify_at: string,
    public creatorId: string,
    public createdAt: string,
    public updatedAt: string,
    public opNome: string,
    public opInstituicao: string,
    public opDescricao: string,
    public opValor: string,
    public opJurosType: "a.m." | "a.a.",
    public opJuros: string
  ) {}
}

class AddCFDTO {
  constructor(
    public id: string,
    public fazendaId: string,
    public fileName: string,
    public fileURL: string,
    public vencimento: string,
    public notify_at: string,
    public creatorId: string,
    public createdAt: string,
    public updatedAt: string,
    public opNome: string,
    public opInstituicao: string,
    public opDescricao: string,
    public opValor: string,
    public opJurosType: "a.m." | "a.a.",
    public opJuros: string
  ) {}
}

class UpdateCFDTO {
  constructor(
    public id: string,
    public fazendaId: string,
    public fileName: string,
    public fileURL: string,
    public vencimento: string,
    public notify_at: string,
    public creatorId: string,
    public createdAt: string,
    public updatedAt: string,
    public opNome: string,
    public opInstituicao: string,
    public opDescricao: string,
    public opValor: string,
    public opJurosType: "a.m." | "a.a.",
    public opJuros: string
  ) {}
}

const CFSchema = yup.object().shape({
  id: yup.string().required(),
  fazendaId: yup.string().required(),
  fileName: yup.string().required(),
  fileURL: yup.string().required(),
  vencimento: yup.string().required(),
  notify_at: yup.string().required(),
  creatorId: yup.string().required(),
  createdAt: yup.date().required(),
  updatedAt: yup.date().required(),
  opNome: yup.string().required(),
  opInstituicao: yup.string().required(),
  opDescricao: yup.string().required(),
  opValor: yup.string().required(),
  opJurosType: yup.string().oneOf(["a.m.", "a.a."]).required(),
  opJuros: yup.string().required(),
});

const addCFSchema = yup.object().shape({
  fazendaId: yup.string().required(),
  fileName: yup.string().required(),
  fileURL: yup.string().required(),
  vencimento: yup.string().required(),
  notify_at: yup.string().required(),
  creatorId: yup.string().required(),
  createdAt: yup.date().required(),
  updatedAt: yup.date().required(),
  opNome: yup.string().required(),
  opInstituicao: yup.string().required(),
  opDescricao: yup.string().required(),
  opValor: yup.string().required(),
  opJurosType: yup.string().oneOf(["a.m.", "a.a."]).required(),
  opJuros: yup.string().required(),
});

const updateCFSchema = yup.object().shape({
  id: yup.string().required(),
  fazendaId: yup.string().required(),
  fileName: yup.string().required(),
  fileURL: yup.string().required(),
  vencimento: yup.string().required(),
  notify_at: yup.string().required(),
  creatorId: yup.string().required(),
  createdAt: yup.date().required(),
  updatedAt: yup.date().required(),
  opNome: yup.string().required(),
  opInstituicao: yup.string().required(),
  opDescricao: yup.string().required(),
  opValor: yup.string().required(),
  opJurosType: yup.string().oneOf(["a.m.", "a.a."]).required(),
  opJuros: yup.string().required(),
});

export { CFDTO, AddCFDTO, UpdateCFDTO, CFSchema, addCFSchema, updateCFSchema };
