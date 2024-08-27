import * as yup from "yup";

enum Status {
  APPROVED = "approved",
  REJECTED = "rejected",
  PENDING = "pending",
}

class CnacDTO {
  constructor(
    public fileUrl: string,
    public fileName: string,
    public status: Status
  ) {}
}

const cnacSchema = yup.object().shape({
  fileUrl: yup.string().required(),
  fileName: yup.string().required(),
  status: yup.string().oneOf(["approved", "rejected", "pending"]).required(),
});

export { Status, CnacDTO, cnacSchema };
