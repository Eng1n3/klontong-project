import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '../constants';
import { Role } from '../enum/roles.enum';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
