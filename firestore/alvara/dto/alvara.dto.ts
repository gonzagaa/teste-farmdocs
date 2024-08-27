import * as yup from "yup";

enum Status {
  APPROVED = "approved",
  REJECTED = "rejected",
  PENDING = "pending",
}

class AlvaraDTO {
  constructor(
    public fileUrl: string,
    public fileName: string,
    public status: Status
  ) {}
}

const alvaraSchema = yup.object().shape({
  fileUrl: yup.string().required(),
  fileName: yup.string().required(),
  status: yup.string().oneOf(["approved", "rejected", "pending"]).required(),
});

export { Status, AlvaraDTO, alvaraSchema };
