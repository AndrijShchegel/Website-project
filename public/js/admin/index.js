import { checkForAccess } from "./checkForAccess.js";
import { createSettingsButton } from "../auth/authorization.js";
import { createMenu } from "../common/createMenu.js";
import { addBookCreationInputs } from "../book/bookCreation.js";


checkForAccess();
createSettingsButton();
createMenu();
addBookCreationInputs();
