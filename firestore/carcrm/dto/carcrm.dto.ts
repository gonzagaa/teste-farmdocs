import * as yup from "yup";

enum Status {
  APPROVED = "approved",
  REJECTED = "rejected",
  PENDING = "pending",
}

class CarCrmDTO {
  constructor(
    public fileUrl: string,
    public fileName: string,
    public status: Status
  ) {}
}

const carCrmSchema = yup.object().shape({
  fileUrl: yup.string().required(),
  fileName: yup.string().required(),
  status: yup.string().oneOf(["approved", "rejected", "pending"]).required(),
});

export { Status, CarCrmDTO, carCrmSchema };
