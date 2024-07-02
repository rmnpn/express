import {smsService} from "./sms.service";
import {smsTemplates} from "../constants/sms.constant";
import {ESMSAction} from "../enums/sms-action.enum";

class PrepareSmsService {
  public async register(
    number: string,
    context: { name: string },
  ): Promise<void> {
    const message = smsTemplates[ESMSAction.WELCOME](context);
      await smsService.sendSMS(number,message);
}}

export const prepareSmsService = new PrepareSmsService();
