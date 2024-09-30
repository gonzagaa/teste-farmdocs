import * as yup from "yup";

class FazendaDTO {
  constructor(
    public id: string,
    public name: string,
    public creatorId: string,
    public thumbnail: string,
    public carURL: string,
    public ccirURL: string,
    public itrURL: string,
    public inscricaoEstadualURL: string,
    public contratoArrendamentoURL: string
  ) {}
}

class AddFazendaDTO {
  constructor(
    public name: string,
    public creatorId: string,
    public thumbnail: string,
    public carURL: string,
    public ccirURL: string,
    public itrURL: string,
    public inscricaoEstadualURL: string,
    public contratoArrendamentoURL: string
  ) {}
}

class UpdateFazendaDTO {
  constructor(
    public id: string,
    public name?: string,
    public creatorId?: string,
    public thumbnail?: string,
    public carURL?: string,
    public ccirURL?: string,
    public itrURL?: string,
    public inscricaoEstadualURL?: string,
    public contratoArrendamentoURL?: string
  ) {}
}

const fazendaSchema = yup.object().shape({
  id: yup.string(),
  thumbnail: yup.string(),
  name: yup.string().required(),
  creatorId: yup.string().required(),
  carURL: yup.string().required(),
  ccirURL: yup.string(),
  itrURL: yup.string(),
  createdAt: yup.date().default(() => new Date()),
  updatedAt: yup.date().default(() => new Date()),
  inscricaoEstadualURL: yup.string().required(),
  contratoArrendamentoURL: yup.string().required(),
});

const addFazendaSchema = yup.object().shape({
  thumbnail: yup.string(),
  name: yup.string().required(),
  creatorId: yup.string().required(),
  carURL: yup.string(),
  ccirURL: yup.string(),
  itrURL: yup.string(),
  inscricaoEstadualURL: yup.string(),
  contratoArrendamentoURL: yup.string(),
});

const updateFazendaSchema = yup.object().shape({
  id: yup.string().required(),
  thumbnail: yup.string(),
  name: yup.string().required(),
  creatorId: yup.string().required(),
  carURL: yup.string().required(),
  ccirURL: yup.string(),
  itrURL: yup.string(),
  inscricaoEstadualURL: yup.string().required(),
  contratoArrendamentoURL: yup.string().required(),
});

export {
  fazendaSchema,
  addFazendaSchema,
  updateFazendaSchema,
  FazendaDTO,
  AddFazendaDTO,
  UpdateFazendaDTO,
};
