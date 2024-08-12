// src/main.ts
import React from 'react'
import ReactDOM from 'react-dom'
import App from '@/App'
import { StoreProvider, useModel } from '@/store'


// 2. 使用StoreProvider包裹App组件
ReactDOM.render(
  <StoreProvider>
    <App />
  </StoreProvider>,
  document.getElementById('root')
)


// 3. 在函数组件中使用，借助useModel
function FunctionDemo() {

  /** 通过useModel取出user状态 */
  const { userInfo, setUserInfo } = useModel('user')

  /** 在点击事件中调用setUserInfo改变状态 */
  const onChangeUser = () => {
    setUserInfo({
      name: userInfo.name + '1',
    })
  }

  // 展示userInfo.name
  return (
    <button onClick={onChangeUser}>{userInfo.name}--改变user中的状态</button>
  )
}

// 4. 在class组件中使用,借助connectModel
// 定义class组件props
interface IClassDemoProps {
  setOther: React.Dispatch<React.SetStateAction<string>>
  other: number
}

class ClassDemo extends Component<IClassDemoProps> {
  // 通过this.props获取到方法修改状态
  onChange = () => {
    this.props.setOther(this.props.other + 1)
  }
  render() {
    // 通过this.props获取到状态进行展示
    return <button onClick={this.onChange}>{this.props.other}</button>
  }
}

// 通过高阶组件connectModel把other状态中的属性和方法注入到类组件中
export default connectModel('other',state => ({
  other: state.other,
  setOther: state.setOther
}))(ClassDemo)