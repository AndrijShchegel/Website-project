import { createSettingsButton } from "../auth/authorization.js";
import { createMenu } from "../common/createMenu.js";
import { checkForNotification } from "../common/notification.js";

createSettingsButton();
createMenu();
checkForNotification();