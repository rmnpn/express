import { EEMailAction } from "../enums/email-action.enum";

export const emailTemplates = {
  [EEMailAction.WELCOME]: {
    templateName: "welcome",
    subject: "Happy to see you in our app, pes!!!",
  },
  [EEMailAction.FORGOT_PASSWORD]: {
    templateName: "forgot-password",
    subject: "Restore penis!!!",
  },
  [EEMailAction.REMIND]: {
    templateName: "remind-users",
    subject: "Ty sho, nahui, penis!!!",
  },
};
