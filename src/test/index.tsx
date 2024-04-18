import {useCallback, useEffect, useState} from 'react';
import CryptoJS, {AES, SHA512, enc} from '@utils/crypto-js';
import {log} from '@utils';
import * as gitlabApi from '@utils/gitlab';

export function CryptoJsDemo() {
  const ciphertext = AES.encrypt('my message', 'secret key 123').toString();
  const bytes  = AES.decrypt(ciphertext, 'secret key 123');
  const originalText = bytes.toString(enc.Utf8);
  
  log('CryptoJsDemo', {
    ciphertext,
    originalText,
  });

  const a = enc.Utf16.parse("Hello, World!");
  const b = enc.Utf16.stringify(a);
  log('a b', {
    a,
    b
  });
  
  return (
    <div>
      <div>CryptoJsDemo</div>
    </div>
  );
}

export function GitlabTest() {
  useEffect(() => {
    gitlabApi.setProjectConfig({
      id: 52878930,
      token: 'glpat-cCQio3nijxPqyK8QJxMs',
      branch: 'main',
    });
  }, []);
  
  const onClick= useCallback(async (type: string) => {
    let res: any;
    try {
      if (type === 'getFilesOfPath') {
        res = await gitlabApi.getRepositoryTree();
      } else if(type === 'downFile') {
        res = await gitlabApi.downFile({path: 'todo-add.json'});
      } else if(type === 'getFileUrl') {
        res = gitlabApi.getFileUrl({path: 'aa/bb.ss'});
      } else if(type === 'uploadFiles') {
        res = await gitlabApi.uploadFiles({
          path: 'images/aaa.md',
          content: '# h1\n\n啊啊啊啊啊',
        }, '测试 uploadFiles');
      } else if(type === 'updateFile') {
        res = await gitlabApi.updateFile({
          content: 'aaaa\n\nbbbb cc dd 00 11',
          path: 'images/aaa.md',
        }, '测试updateFile 2');
      } else if(type === 'delFiles') {
        res = await gitlabApi.delFiles('images/aaa.md', '测试 delFiles');
      }
      log(type, res);
    } catch (e) {
      log('catch', e);
    }
  }, []);
  
  return (
    <div>
      <button onClick={() => onClick('getFilesOfPath')}>getFilesOfPath</button>
      <button onClick={() => onClick('downFile')}>downFile</button>
      <button onClick={() => onClick('getFileUrl')}>getFileUrl</button>
      <button onClick={() => onClick('uploadFiles')}>uploadFiles</button>
      <button onClick={() => onClick('updateFile')}>updateFile</button>
      <button onClick={() => onClick('delFiles')}>delFiles</button>
    </div>
  );
}

function App() {
  return (
    <div>
      <h1>test</h1>
      <CryptoJsDemo />
    </div>
  );
}

export default App;
