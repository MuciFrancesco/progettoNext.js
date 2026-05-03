import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// FIX rispetto a StudioBE:
// - aggiunto @Injectable() (mancava)
// - rimosso costruttore inutile
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {}
