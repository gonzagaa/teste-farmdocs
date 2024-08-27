import * as yup from "yup";

enum Status {
  APPROVED = "approved",
  REJECTED = "rejected",
  PENDING = "pending",
}

class CrmDTO {
  constructor(
    public fileUrl: string,
    public fileName: string,
    public registry: string,
    public status: Status
  ) {}
}

const crmSchema = yup.object().shape({
  fileUrl: yup.string().required(),
  registry: yup.string().required(),
  status: yup.string().oneOf(["approved", "rejected", "pending"]).required(),
});

export { Status, CrmDTO, crmSchema };
