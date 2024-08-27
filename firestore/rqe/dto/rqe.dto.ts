import * as yup from "yup";

enum Status {
  APPROVED = "approved",
  REJECTED = "rejected",
  PENDING = "pending",
}

// enum Specialties {
//   PSYCHIATRY = "psychiatry",
//   PSYCHOLOGY = "psychology",
// }

class RqeDTO {
  constructor(
    public registry: string,
    public specialty: string,
    public status: Status
  ) {
    this.registry = registry;
    this.specialty = specialty;
    this.status = status;
  }
}

const rqeSchema = yup.object().shape({
  registry: yup.string().required(),
  specialty: yup.string().required(),
  status: yup.string().oneOf(Object.values(Status)).required(),
});

export { Status, RqeDTO, rqeSchema };
