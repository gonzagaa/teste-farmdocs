import * as yup from "yup";
import { RqeDTO } from "../../rqe/dto/rqe.dto";

enum Status {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

class ProdutoDTO {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public price: number,
    public specialty: string,
    public thumbnail: string,
    public stripeProductId: string,
    public customerId: string,
    public customerEmail: string,
    public customerName: string,
    public medicoId: string,
    public medicoCRM: string,
    public medicoName: string,
    public agendamentoDate: string,
  ) {}
}

class AddProdutoDTO {
  constructor(
    public name: string,
    public description: string,
    public price: number,
    public specialty: string,
    public thumbnail: string,
    public stripeProductId: string
  ) {}
}

class UpdateProdutoDTO {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public price: number,
    public specialty: string,
    public thumbnail: string,
    public stripeProductId: string
  ) {}
}

const produtoSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().required(),
  price: yup.number().required(),
  rqe: yup.object(),
  thumbnail: yup.string().required(),
  stripeProductId: yup.string().required(),
});

export { Status, ProdutoDTO, AddProdutoDTO, UpdateProdutoDTO, produtoSchema };
