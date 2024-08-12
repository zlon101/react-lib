import { useState } from 'react'
import createStore from './createStore'


/** 2. 定义各个状态 */
// user
const userModel = () => {
  const [ userInfo, setUserInfo ] = useState<{ name: string }>({ name: 'name' })
  return { userInfo, setUserInfo }
}

// other
const otherModel = () => {
  const [ other, setOther ] = useState<number>(20)
  return { other, setOther }
}


/** 3. 组合所有状态 */
const store = createStore(() => ({
  user: userModel(),
  other: otherModel(),
}))

/** 向外暴露useModel, StoreProvider, getModel, connectModel */
export const { useModel, StoreProvider, getModel, connectModel } = store