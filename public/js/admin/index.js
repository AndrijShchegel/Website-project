import { checkForAccess } from "./checkForAccess.js";
import { createSettingsButton } from "../auth/authorization.js";
import { createMenu } from "../common/createMenu.js";
import { addBookCreationInputs } from "../book/bookCreate.js";
import { addBookDeletionInputs } from "../book/bookDelete.js";
import { addBookUpdateInputs } from "../book/bookUpdate.js";


checkForAccess();
createSettingsButton();
createMenu();
addBookCreationInputs();
addBookDeletionInputs();
addBookUpdateInputs();
