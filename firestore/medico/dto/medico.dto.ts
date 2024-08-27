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

type TaxClassification = "PF" | "CNPJ";

class MedicoDTO extends UserDTO {
  public taxClassification: TaxClassification;
  public crm: CrmDTO;
  public rqe: RqeDTO;
  public cnac: CnacDTO;
  public ca: CaDTO;
  public carCrm: CarCrmDTO;
  public cnpj: CnpjDTO;
  public alvara: AlvaraDTO;
  public cb: CbDTO;
  public ctep: CtepDTO;
  public pis: string;

  constructor(
    id: string,
    name: string,
    registryCode: string,
    birthdate: string,
    email: string,
    phone: string,
    thumbnail: string,
    taxClassification: TaxClassification,
    crm: CrmDTO,
    rqe: RqeDTO,
    cnac: CnacDTO,
    ca: CaDTO,
    carCrm: CarCrmDTO,
    cnpj: CnpjDTO,
    alvara: AlvaraDTO,
    cb: CbDTO,
    ctep: CtepDTO,
    pis: string
  ) {
    super(id, name, registryCode, birthdate, email, phone, thumbnail);
    this.taxClassification = taxClassification;
    this.crm = crm;
    this.rqe = rqe;
    this.cnac = cnac;
    this.ca = ca;
    this.carCrm = carCrm;
    this.cnpj = cnpj;
    this.alvara = alvara;
    this.cb = cb;
    this.ctep = ctep;
    this.pis = pis;
  }
}

class AddMedicoDTO extends MedicoDTO {
  public cs: CsDTO;
  public password: string;

  constructor(
    id: string,
    name: string,
    registryCode: string,
    birthdate: string,
    email: string,
    phone: string,
    thumbnail: string,
    taxClassification: TaxClassification,
    crm: CrmDTO,
    rqe: RqeDTO,
    cnac: CnacDTO,
    ca: CaDTO,
    carCrm: CarCrmDTO,
    cnpj: CnpjDTO,
    alvara: AlvaraDTO,
    cb: CbDTO,
    ctep: CtepDTO,
    pis: string,
    cs: CsDTO,
    password: string
  ) {
    super(
      id,
      name,
      registryCode,
      birthdate,
      email,
      phone,
      thumbnail,
      taxClassification,
      crm,
      rqe,
      cnac,
      ca,
      carCrm,
      cnpj,
      alvara,
      cb,
      ctep,
      pis
    );
    this.cs = cs;
    this.password = password;
  }
}

class UpdateMedicoDTO extends MedicoDTO {
  constructor(
    id: string,
    name: string,
    registryCode: string,
    birthdate: string,
    email: string,
    phone: string,
    thumbnail: string,
    taxClassification: TaxClassification,
    crm: CrmDTO,
    rqe: RqeDTO,
    cnac: CnacDTO,
    ca: CaDTO,
    carCrm: CarCrmDTO,
    cnpj: CnpjDTO,
    alvara: AlvaraDTO,
    cb: CbDTO,
    ctep: CtepDTO,
    pis: string
  ) {
    super(
      id,
      name,
      registryCode,
      birthdate,
      email,
      phone,
      thumbnail,
      taxClassification,
      crm,
      rqe,
      cnac,
      ca,
      carCrm,
      cnpj,
      alvara,
      cb,
      ctep,
      pis
    );
  }
}

const medicoSchema = yup.object().shape({
  ...userSchema.fields,
  taxClassification: yup.string().oneOf(["PF", "CNPJ"]).required(),
  crm: yup.object().required(),
  rqe: yup.object().required(),
  cnac: yup.object().required(),
  ca: yup.object().required(),
  carCrm: yup.object().required(),
  cnpj: yup.object().required(),
  alvara: yup.object(),
  cb: yup.object(),
  ctep: yup.object(),
  pis: yup.string(),
});

const addMedicoSchema = yup.object().shape({
  ...medicoSchema.fields,
  password: yup.string().required(),
});

const updateMedicoSchema = yup.object().shape({
  ...medicoSchema.fields,
});

export {
  medicoSchema,
  addMedicoSchema,
  updateMedicoSchema,
  MedicoDTO,
  TaxClassification,
  AddMedicoDTO,
  UpdateMedicoDTO,
};
