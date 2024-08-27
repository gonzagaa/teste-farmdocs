import * as yup from "yup";

enum Status {
  APPROVED = "approved",
  REJECTED = "rejected",
  PENDING = "pending",
}

class CnpjDTO {
  constructor(
    public fileUrl: string,
    public fileName: string,
    public registry: string,
    public status: Status
  ) {}
}

const cnpjDTOSchema = yup.object().shape({
  fileUrl: yup.string().required(),
  fileName: yup.string().required(),
  status: yup.string().oneOf(["approved", "rejected", "pending"]).required(),
  registry: yup.string().required(),
});

export { Status, CnpjDTO, cnpjDTOSchema };
