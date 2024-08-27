import * as yup from "yup";

import { AlvaraDTO } from "../../alvara/dto/alvara.dto";
import { CaDTO } from "../../ca/dto/ca.dto";
import { CarCrmDTO } from "../../carcrm/dto/carcrm.dto";
import { CbDTO } from "../../cb/dto/cb.dto";
import { CnacDTO } from "../../cnac/dto/cnac.dto";
import { CrmDTO } from "../../crm/dto/crm.dto";
import { CtepDTO } from "../../ctep/dto/ctep.dto";
import { RqeDTO } from "../../rqe/dto/rqe.dto";
import { UserDTO, userSchema } from "../../usuario/dto/usuario.dto";
import { CsDTO } from "../../cs/dto/cs.dto";
import { CnpjDTO } from "../../cnpj/dto/cnpj.dot";

type TimeBlock = {
  inicio?: string;
  fim?: string;
};

class PlantaoDTO {
  id: string;
  medicoId: string;
  start: string;
  end: string;

  constructor(id: string, medicoId: string, start: string, end: string) {
    this.id = id;
    this.medicoId = medicoId;
    this.start = start;
    this.end = end;
  }
}

class AddPlantaoDTO {
  medicoId: string;
  start: string;
  end: string;

  constructor(medicoId: string, start: string, end: string) {
    this.medicoId = medicoId;
    this.start = start;
    this.end = end;
  }
}

class UpdatePlantaoDTO {
  id: string;
  medicoId: string;
  start: string;
  end: string;

  constructor(id: string, medicoId: string, start: string, end: string) {
    this.id = id;
    this.medicoId = medicoId;
    this.start = start;
    this.end = end;
  }
}

class EscalaDTO {
  id: string;
  medicoId: string;
  availableDates: string[];

  constructor(id: string, availableDates: string[], medicoId: string) {
    this.id = id;
    this.availableDates = availableDates;
    this.medicoId = medicoId;
  }
}

class AddEscalaDTO {
  medicoId: string;
  availableDates: string[];

  constructor(availableDates: string[], medicoId: string) {
    this.availableDates = availableDates;
    this.medicoId = medicoId;
  }
}

class UpdateEscalaDTO {
  id: string;
  medicoId: string;
  availableDates: string[];

  constructor(id: string, availableDates: string[], medicoId: string) {
    this.id = id;
    this.availableDates = availableDates;
    this.medicoId = medicoId;
  }
}

const escalaSchema = yup.object().shape({
  medicoId: yup.string().required(),
  availableDates: yup.array().of(yup.string()).required(),
});

const addEscalaSchema = yup.object().shape({
  ...escalaSchema.fields,
  availableDates: yup.array().of(yup.string()).required(),
});

const updateEscalaSchema = yup.object().shape({
  ...escalaSchema.fields,
  availableDates: yup.array().of(yup.string()).required(),
});

const plantaoSchema = yup.object().shape({
  medicoId: yup.string().required(),
  start: yup.string().required(),
  end: yup.string().required(),
});

const addPlantaoSchema = yup.object().shape({
  ...plantaoSchema.fields,
  start: yup.string().required(),
  end: yup.string().required(),
});

const updatePlantaoSchema = yup.object().shape({
  ...plantaoSchema.fields,
  start: yup.string().required(),
  end: yup.string().required(),
});

export {
  EscalaDTO,
  AddEscalaDTO,
  UpdateEscalaDTO,
  PlantaoDTO,
  AddPlantaoDTO,
  UpdatePlantaoDTO,
  escalaSchema,
  addEscalaSchema,
  updateEscalaSchema,
  plantaoSchema,
  addPlantaoSchema,
  updatePlantaoSchema,
};
