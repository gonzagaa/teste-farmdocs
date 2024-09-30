import * as yup from "yup";

class NotificationDTO {
  constructor(
    public id: string,
    public notify_at: string,
    public fazendaId: string,
    public fazendaName: string,
    public creatorId: string,
    public title: string,
    public vencimento: string,
    public notification: string,
    public description: string
  ) {}
}

class ADDNotificationDTO {
  constructor(
    public notify_at: string,
    public fazendaId: string,
    public fazendaName: string,
    public creatorId: string,
    public title: string,
    public vencimento: string,
    public notification: string,
    public description: string
  ) {}
}

class UpdateNotificationDTO {
  constructor(
    public id: string,
    public notify_at: string,
    public fazendaId: string,
    public fazendaName: string,
    public creatorId: string,
    public title: string,
    public vencimento: string,
    public notification: string,
    public description: string
  ) {}
}

const NotificationSchema = yup.object().shape({
  notify_at: yup.string().required(),
  fazendaId: yup.string().required(),
  fazendaName: yup.string().required(),
  creatorId: yup.string().required(),
  title: yup.string().required(),
  description: yup.string().required(),
});

const addNotificationSchema = yup.object().shape({
  notify_at: yup.string().required(),
  fazendaId: yup.string().required(),
  fazendaName: yup.string().required(),
  creatorId: yup.string().required(),
  title: yup.string().required(),
  description: yup.string().required(),
});

const updateNotificationSchema = yup.object().shape({
  id: yup.string().required(),
  notify_at: yup.string().required(),
  fazendaId: yup.string().required(),
  fazendaName: yup.string().required(),
  creatorId: yup.string().required(),
  title: yup.string().required(),
  description: yup.string().required(),
});

export {
  NotificationDTO,
  ADDNotificationDTO,
  UpdateNotificationDTO,
  NotificationSchema,
  addNotificationSchema,
  updateNotificationSchema,
};
