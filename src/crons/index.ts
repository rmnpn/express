import { userReminder } from "./remind-user-thirty-days.cron";
import { tokensRemover } from "./remove-old-tokens.cron";

export const runAllCronJobs = () => {
  tokensRemover.start();
  userReminder.start();
};
