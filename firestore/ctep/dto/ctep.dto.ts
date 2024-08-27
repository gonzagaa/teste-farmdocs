import * as yup from "yup";

enum Status {
  APPROVED = "approved",
  REJECTED = "rejected",
  PENDING = "pending",
}

class CtepDTO {
  constructor(
    public fileUrl: string,
    public fileName: string,
    public status: Status
  ) {}
}

const ctepDTOSchema = yup.object().shape({
  fileUrl: yup.string().required(),
  fileName: yup.string().required(),
  status: yup.string().oneOf(["approved", "rejected", "pending"]).required(),
});

export { Status, CtepDTO, ctepDTOSchema };
