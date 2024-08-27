import { ReactNode } from "react";
import * as yup from "yup";

enum Status {
  CANCELED = "canceled",
  WAITING = "waiting",
  SCHEDULED = "scheduled",
  MISSING = "missing",
  SUCCEEDED = "succeeded",
}

class Queixa {
  constructor(public sintomas: string, public historico: string) {}
}

class EstadoGeral {
  constructor(public beg: boolean, public reg: boolean, public meg: boolean) {}
}

class Desfecho {
  constructor(public prontoAtendimento: boolean, public orientacao: boolean) {}
}

class Prontuario {
  constructor(
    public queixa: Queixa,
    public antecedentes: string,
    public estadoGeral: EstadoGeral,
    public icteria: boolean,
    public cianose: boolean,
    public palidez: boolean,
    public euperico: boolean,
    public conduta: string,
    public hipoteseDiagnostica: string,
    public desfecho: Desfecho
  ) {}
}

class ConsultaDTO {
  patientData: ReactNode;
  usuarioPhone: ReactNode;
  constructor(
    public id: string,
    public prontuario: Prontuario,
    public price: number,
    public specialty: string,
    public thumbnail: string,
    public stripeProductId: string,
    public patientId: string,
    public patientEmail: string,
    public patientName: string,
    public medicoId: string,
    public medicoCRM: string,
    public medicoName: string,
    public data: string,
    public paymentIntentId: string,
    public paymentStatus: string,
    public status: string,
    public createdAt: string,
    public updatedAt: string,
    public roomId?: string
  ) {}
}

class AddConsultaDTO {
  constructor(
    public price: number,
    public specialty: string,
    public thumbnail: string,
    public stripeProductId: string,
    public patientId: string,
    public patientEmail: string,
    public patientName: string,
    public medicoId: string,
    public medicoCRM: string,
    public medicoName: string,
    public data: string,
    public paymentIntentId: string,
    public paymentStatus: string,
    public status: string,
    public roomId?: string,
    public createdAt?: string,
    public updatedAt?: string,
    public prontuario?: Prontuario
  ) {}
}

class UpdateConsultaDTO {
  constructor(
    public id: string,
    public price: number,
    public specialty: string,
    public thumbnail: string,
    public stripeProductId: string,
    public patientId: string,
    public patientEmail: string,
    public patientName: string,
    public medicoId: string,
    public medicoCRM: string,
    public medicoName: string,
    public data: string,
    public paymentIntentId: string,
    public paymentStatus: string,
    public status: string,
    public roomId?: string,
    public createdAt?: string,
    public updatedAt?: string,
    public prontuario?: Prontuario
  ) {}
}

const addConsultaSchema = yup.object().shape({
  price: yup.number().required(),
  specialty: yup.string().required(),
  thumbnail: yup.string(),
  stripeProductId: yup.string().required(),
  patientId: yup.string().required(),
  patientEmail: yup.string().required(),
  patientName: yup.string().required(),
  medicoId: yup.string(),
  medicoCRM: yup.string(),
  medicoName: yup.string(),
  data: yup.string().required(),
  paymentIntentId: yup.string().required(),
  paymentStatus: yup.string().required(),
  status: yup.string().required(),
  roomId: yup.string(),
  createdAt: yup.string().required(),
  updatedAt: yup.string().required(),
  prontuario: yup
    .object()
    .shape({
      queixa: yup.object().shape({
        sintomas: yup.string(),
        historico: yup.string(),
      }),
      antecedentes: yup.string(),
      estadoGeral: yup.object().shape({
        beg: yup.boolean(),
        reg: yup.boolean(),
        meg: yup.boolean(),
      }),
      icteria: yup.boolean(),
      cianose: yup.boolean(),
      palidez: yup.boolean(),
      euperico: yup.boolean(),
      conduta: yup.string(),
      hipoteseDiagnostica: yup.string(),
      desfecho: yup.object().shape({
        prontoAtendimento: yup.boolean(),
        orientacao: yup.boolean(),
      }),
    })
    .optional(),
});

export {
  Status,
  ConsultaDTO,
  addConsultaSchema,
  AddConsultaDTO,
  UpdateConsultaDTO,
};
