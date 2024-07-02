import { CronJob } from "cron";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { EEMailAction } from "../enums/email-action.enum";
import { ApiError } from "../errors/api.error";
import { userRepository } from "../repositories/user.repository";
import { emailService } from "../services/email.service";

dayjs.extend(utc);

const remindUser = async function () {
  try {
    const date = dayjs().utc().subtract(30, "d").toDate();
    const users = await userRepository.findWithoutActivityAfter(date);
    await Promise.all(
      users.map(async (user) => {
        console.log(user.email);
        await emailService.sendMail(user.email, EEMailAction.REMIND, {
          name: user.name,
        });
      }),
    );
  } catch (e) {
    throw new ApiError(e.message, e.status);
  }
};
export const userReminder = new CronJob("* * * * * *", remindUser);
