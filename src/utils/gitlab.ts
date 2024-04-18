/**
 * 使用 Gitlab api 查询仓库信息
 * API 参考: https://docs.gitlab.com/ee/api/repositories.html
 * 获取参考文件目录: https://gitlab.com/api/v4/projects/{projectId}/repository/tree?recursive=true&ref=分支名
 * gitlab api url 中的 query 必须与文档上的一致，不能随意使用 encodeURIComponent
 * *******/

// 项目配置
interface IProjectConfig {
  baseURL: string;
  id: string | number;
  branch: string;
  path: string; // mp3/xxx.mp3
  token: string;
  // 是否递归查询
  recursive?: boolean;
}

type CustomRequired<T, K extends keyof T> = {
  [P in K]-?: T[P];
} & Partial<Omit<T, K>>

const ProjectCfg: IProjectConfig = {
  baseURL: 'https://gitlab.com/api/v4',
  id: 0,
  branch: 'main',
  path: '', // music-琳
  token: '',
};

export function setProjectConfig(cfg: any) {
  Object.assign(ProjectCfg, cfg);
}

// fetch 响应
interface IResponse {
  ok: boolean;
  status: number;
  statusText: string;
  url: string;
  json: () => any;
  // headers: object;
  // body: object;
}

async function handleResponse(res: IResponse) {
  const json = await res.json();
  if (res.status >= 200 && res.status <300) {
    return json;
  }
  throw {...json, status: res.status};
}

// 身份验证: query: private_token 或 header: PRIVATE-TOKEN
function createFetchOption(m: string, t: string, body?: any) {
  const opt: any = {
    method: m.toUpperCase(),
    headers: {
      'PRIVATE-TOKEN': t,
    },
  };
  if (['PUT', 'POST'].includes(opt.method)) {
    opt.headers['Content-Type'] = 'application/json';
  }
  if (body !== undefined) {
    opt.body = body;
  }
  return opt;
}

// 获取仓库目录结构
export const getRepositoryTree = async (projectCfg?: Partial<IProjectConfig>): Promise<any[]> => {
  const _project = {...ProjectCfg, ...projectCfg};
  const param = {
    ref: _project.branch,
    recursive: _project.recursive || false,
  };
  const url = `${_project.baseURL}/projects/${_project.id}/repository/tree/?${transformQuery(param)}`;
  const response: IResponse = await fetch(url, createFetchOption('GET', _project.token));
  return handleResponse(response);
};

// 接口响应
export interface IFileListItem {
  id: string;
  name: string;
  type: string;
  path: string;
  mode: string;
}

// 分页配置
interface IPaging {
  page: number;
  per_page?: number;
}
// 获取路径下的文件列表
export async function getFilesOfPath(projectCfg: CustomRequired<IProjectConfig, 'path'>, paging: IPaging) {
  const _p = {...ProjectCfg, ...projectCfg};
  const param = {
    recursive: _p.recursive || false,
    // private_token: _p.token,
    ref: _p.branch,
    path: _p.path,
    per_page: 30,
    ...paging,
  };
  const url = `${_p.baseURL}/projects/${_p.id}/repository/tree/?${transformQuery(param)}`;
  const response = await fetch(url, createFetchOption('GET', _p.token));
  return handleResponse(response);
}

// 下载单个 raw 文件
export async function downFile(projectCfg: CustomRequired<IProjectConfig, 'path'>) {
  const _p = {...ProjectCfg, ...projectCfg};
  const response = await fetch(getFileUrl(projectCfg), createFetchOption('get', _p.token));
  return handleResponse(response);
}

/**
 * 获取单个 raw 文件
 * https://gitlab.com/api/v4/projects/52878930/repository/files/images%2FWechatIMG29.jpg/raw?private_token=xxx&ref=main
 * **/
export function getFileUrl(projectCfg: CustomRequired<IProjectConfig, 'path'>) {
  const _p = {...ProjectCfg, ...projectCfg};
  const filePath = encodeURIComponent(_p.path);
  const query = {
    private_token: _p.token,
    ref: _p.branch,
  };
  return `${_p.baseURL}/projects/${_p.id}/repository/files/${filePath}/raw?${transformQuery(query)}`;
}

/**
 * 创建一个commit: https://docs.gitlab.com/ee/api/commits.html#create-a-commit-with-multiple-files-and-actions
 * ********/
interface IAction {
  action: 'create' | 'delete' | 'move' | 'update' | 'chmod';
  previous_path?: string;
  file_path?: string;
  content?: string;
  encoding?: 'text' | 'base64';
  last_commit_id?: string;
  execute_filemode?: boolean;
}
async function createCommit(actions: IAction[], commitMsg: string, projectCfg?: Partial<IProjectConfig>) {
  const _p = {...ProjectCfg, ...projectCfg};
  const url = `${_p.baseURL}/projects/${_p.id}/repository/commits`;
  const body = JSON.stringify({
    id: _p.id,
    branch: _p.branch,
    commit_message: commitMsg,
    actions,
  });
  const response = await fetch(url, createFetchOption('post', _p.token, body));
  return handleResponse(response);
}

/**
 * 上传文件
 * *****/
type IFile = {
  path: string;
  content: string;
  encoding?: IAction['encoding'];
};
export async function uploadFiles(files: IFile | IFile[], commitMsg: string, projectConf?: Partial<IProjectConfig>) {
  if (!Array.isArray(files)) {
    files = [files];
  }
  const actions: IAction[] = files.map((fileItem) => ({
    file_path: fileItem.path,
    action: 'create',
    encoding: fileItem.encoding || 'text',
    content: fileItem.content,
  }));
  return await createCommit(actions, commitMsg, projectConf);
}

// 更新文件
export async function updateFile(files: IFile | IFile[], commit_message: string, proConf?: Partial<IProjectConfig>) {
  if (!Array.isArray(files)) {
    files = [files];
  }
  const actions: IAction[] = files.map((fileItem) => ({
    file_path: fileItem.path,
    action: 'update',
    encoding: fileItem.encoding || 'text',
    content: fileItem.content,
  }));
  return await createCommit(actions, commit_message, proConf);
}

// 删除文件
export async function delFiles(files: string | string[], commitMsg: string, proConf?: Partial<IProjectConfig>) {
  if (!files || !files?.length) {return;}
  if (!Array.isArray(files)) {
    files = [files];
  }
  const actions: IAction[] = files.map(s => ({
    file_path: s,
    action: 'delete',
  }));
  return await createCommit(actions, commitMsg, proConf);
}

function transformQuery(val: string | object): string | object {
  if (typeof val === 'string') {
    val = decodeURIComponent(val);
    return val.split('&').reduce((acc, itemStr) => {
      // eslint-disable-next-line prefer-const
      let [k, v]: [string, string | number] = itemStr.split('=') as [string, string];
      v = Number.isNaN(Number(v)) ? v : Number(v);
      acc[k] = v;
      return acc;
    }, {} as any);
  }
  if (typeof val === 'object') {
    return Object.getOwnPropertyNames(val)
      .map(k => {
        // @ts-ignore
        return `${k}=${val[k]}`;
      })
      .join('&');
  }
  return val;
}
