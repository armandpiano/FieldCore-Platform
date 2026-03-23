import { SetMetadata } from '@nestjs/common';

export const IS_ORG_REQUIRED_KEY = 'orgRequired';
export const RequireOrganization = () => SetMetadata(IS_ORG_REQUIRED_KEY, true);
