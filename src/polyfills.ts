
import * as crypto from 'crypto';


if (typeof global.crypto === 'undefined') {
  (global as any).crypto = {};
}

if (typeof global.crypto.randomUUID === 'undefined') {
  (global.crypto as any).randomUUID = function randomUUID() {
    return crypto.randomUUID();
  };
}
