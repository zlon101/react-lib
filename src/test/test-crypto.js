import {webDecrypt, webEncrypt, log} from '@utils';

const srcMsg = 'aabb-11';
const ps = '1234';
const encrypted = webEncrypt(srcMsg, ps);
log('encrypted', encrypted);
