import React from 'react'
import moment from 'moment'

class Status extends React.PureComponent {
  constructor(props){
    super(props)
    this.state = {}
  }

  render () {

    let cur = parseInt(moment(Date.now()).format('YYYYMMDD'))
    let select = this.props.date
    let editOk = true
    if(select < cur) editOk = false
    if(select === cur && moment().hour() >= 11) editOk = false

    return (
      <span style={{color: 'black'}}>
        {/*{editOk ? '': ' [ Khóa sổ ] '}*/}
      </span>
    )
  }
}

export default Status