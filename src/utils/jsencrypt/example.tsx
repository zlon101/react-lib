import {useState} from 'react';
import {JSEncrypt} from './index';
import {log} from '@utils';

const Privkey = `-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQDlOJu6TyygqxfWT7eLtGDwajtNFOb9I5XRb6khyfD1Yt3YiCgQ
WMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76xFxdU6jE0NQ+Z+zEdhUTooNR
aY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4gwQco1KRMDSmXSMkDwIDAQAB
AoGAfY9LpnuWK5Bs50UVep5c93SJdUi82u7yMx4iHFMc/Z2hfenfYEzu+57fI4fv
xTQ//5DbzRR/XKb8ulNv6+CHyPF31xk7YOBfkGI8qjLoq06V+FyBfDSwL8KbLyeH
m7KUZnLNQbk8yGLzB3iYKkRHlmUanQGaNMIJziWOkN+N9dECQQD0ONYRNZeuM8zd
8XJTSdcIX4a3gy3GGCJxOzv16XHxD03GW6UNLmfPwenKu+cdrQeaqEixrCejXdAF
z/7+BSMpAkEA8EaSOeP5Xr3ZrbiKzi6TGMwHMvC7HdJxaBJbVRfApFrE0/mPwmP5
rN7QwjrMY+0+AbXcm8mRQyQ1+IGEembsdwJBAN6az8Rv7QnD/YBvi52POIlRSSIM
V7SwWvSK4WSMnGb1ZBbhgdg57DXaspcwHsFV7hByQ5BvMtIduHcT14ECfcECQATe
aTgjFnqE/lQ22Rk0eGaYO80cc643BXVGafNfd9fcvwBMnk0iGX0XRsOozVt5Azil
psLBYuApa66NcVHJpCECQQDTjI2AQhFc1yRnCU/YgDnSpJVm1nASoRUnU8Jfm3Oz
uku7JUXcVpt08DFSceCEX9unCuMcT72rAQlLpdZir876
-----END RSA PRIVATE KEY-----`;

const Pubkey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDlOJu6TyygqxfWT7eLtGDwajtN
FOb9I5XRb6khyfD1Yt3YiCgQWMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76
xFxdU6jE0NQ+Z+zEdhUTooNRaY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4
gwQco1KRMDSmXSMkDwIDAQAB
-----END PUBLIC KEY-----`;

function TestJsencrypt() {
  const [privkey, setPrivkey] = useState(Privkey);
  const [pubkey, setPubkey] = useState(Pubkey);
  const [msg, setMsg] = useState('$原始数据00AA%#');
  const [enMsg, setEnMsg] = useState('');
  const [deMsg, setDeMsg] = useState('');

  const onChangeInput = (k: string, e: any) => {
    const val = e.target.value;
    if (k === 'msg') {
      log('msg length ', val.length);
    }
    const map: any = {
      privkey: setPrivkey,
      pubkey: setPubkey,
      msg: setMsg,
      enMsg: setEnMsg,
      deMsg: setDeMsg,
    };
    map[k](val);
    if (['privkey', 'pubkey', 'msg'].includes(k)) {
      // setEnMsg('');
      setDeMsg('');
    }
  };

  const onEncrypto = () => {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(pubkey);
    log('msg', msg);
    const encrypted = encrypt.encrypt(msg);
    setEnMsg(encrypted);
  };

  const onDecrypto = () => {
    const decrypt = new JSEncrypt();
    decrypt.setPrivateKey(privkey);
    const uncrypted = decrypt.decrypt(enMsg);
    log('uncrypted', uncrypted);
    uncrypted ? setDeMsg(uncrypted) : setDeMsg('');

    if (uncrypted === msg) {
      log('It works!!!');
    } else {
      log('Something went wrong....', undefined, 'error');
    }
  };

  return (
    <div>
      <label>Private Key</label>
      <br />

      <textarea rows={15} cols={65} value={privkey} onChange={e => onChangeInput('privkey', e)}></textarea>
      <br />

      <label>Public Key</label>
      <br />
      <textarea rows={15} cols={65} value={pubkey} onChange={e => onChangeInput('pubkey', e)}></textarea>
      <br />

      <label>原始数据:</label>
      <br />
      <textarea rows={4} cols={70} value={msg} onChange={e => onChangeInput('msg', e)}></textarea>
      <br />

      <button onClick={onEncrypto}>加密</button>
      <label>加密后数据:</label>
      <br />
      <textarea rows={4} cols={70} value={enMsg} onChange={e => onChangeInput('enMsg', e)}></textarea>
      <br />

      <button onClick={onDecrypto}>解密</button>
      <label>解密后数据:</label>
      <br />
      <textarea rows={4} cols={70} value={deMsg} onChange={e => onChangeInput('deMsg', e)}></textarea>
      <br />
    </div>
  );
}

function App() {
  return (
    <div>
      <TestJsencrypt />
    </div>
  );
}

export default App;
