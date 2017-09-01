import React from 'react'
import {Row, Col, Input, Button, message, Select, AutoComplete, InputNumber} from 'antd'
import {slugify} from '../../_function'
const Option = Select.Option;
const tinhArr = require('../../tinhArr.json')
const tinhObj = require('../../tinhObj.json')

class Tinh extends React.PureComponent {
  
  constructor(props){
    super(props)
    this.state = {
    
    }
    this.onChange = this.onChange.bind(this)
  }
  onChange(value) {
    if(this.props.handleChange) this.props.handleChange(value)
  }
  render () {
    
    const value = this.props.value ? this.props.value.name_with_type : tinhObj["01"].name_with_type
    console.log(value)
    
    return (
      <Select
        showSearch
        style={{ width: "32%", marginLeft: 5, marginTop: 5  }}
        defaultValue={this.props.defaultValue ? this.props.defaultValue : "01"}
        optionFilterProp="children"
        placeholder="Tỉnh thành"
        // labelInValue={true}
        onChange={this.onChange}
        // onSelect={this.props.selectOption}
        filterOption={(input, option) => slugify(option.props.children.toLowerCase()).indexOf(slugify(input.toLowerCase())) >= 0}
      >
        {tinhArr.map((tinh, index) => {
          return <Option key={index} value={tinh.code}>{tinh.name_with_type}</Option>
        })}
      </Select>
    )
  }
}

export default Tinh