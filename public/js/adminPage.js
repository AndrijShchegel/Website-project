import { checkForAccess } from "./checkForAccess.js";
import { createSettingsButton } from "./authorization.js";
import { createMenu } from "./createMenu.js";
import { addBookCreationInputs } from "./bookCreation.js";


checkForAccess();
createSettingsButton();
createMenu();
addBookCreationInputs();
