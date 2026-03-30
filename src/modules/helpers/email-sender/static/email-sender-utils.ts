import * as fs from 'node:fs';
import * as path from 'node:path';
import { TOP_LEVEL_PROJECT_ROOT } from '@/common/utility/paths';

export const emailTemplatePath = {
  forgotPassword: 'reset-password.hbs',
  userInvite: 'user-invite.hbs',
  welcomeUser: 'welcome-mail.hbs',
};

export async function readFileAsString(filePath: string): Promise<string> {
  try {
    const emailTemplate = path.join(
      TOP_LEVEL_PROJECT_ROOT,
      'public',
      'email-templates',
      `${filePath}`,
    );
    const fileBuffer = fs.readFileSync(emailTemplate, 'utf-8');
    return fileBuffer;
  } catch (error) {
    console.error(`Error reading file at ${filePath}:`, error);
    throw error;
  }
}
