import { EEMailAction } from "../enums/email-action.enum";

export const emailTemplates = {
  [EEMailAction.WELCOME]: {
    templateName: "welcome",
    subject: "Happy to see you in our app, pes!!!",
  },
};
