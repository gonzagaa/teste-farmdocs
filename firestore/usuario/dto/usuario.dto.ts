import * as yup from "yup";

class UserDTO {
  constructor(
    public id: string,
    public name: string,
    public registryCode: string,
    public birthdate: string,
    public email: string,
    public phone: string,
    public thumbnail: string
  ) {}
}

const userSchema = yup.object().shape({
  id: yup.string(),
  name: yup.string().required(),
  registryCode: yup.string(),
  birthdate: yup.string(),
  email: yup.string().required(),
  phone: yup.string(),
  thumbnail: yup.string(),
});

export { userSchema, UserDTO };
