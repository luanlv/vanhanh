import React from 'react'
import {Row, Col, Input, Button, message, Select, AutoComplete, InputNumber} from 'antd'
import {slugify} from '../_function'
const Option = Select.Option

class CustomSelect extends React.Component {
  render () {
    return (
      <Select
        disabled={this.props.disabled}
        defaultValue={this.props.defaultValue}
        showSearch
        style={{width: '100%'}}
        // value={this.props.value}
        optionFilterProp="children"
        placeholder="Chọn Lái Xe"
        onChange={this.props.handleChange}
        onSelect={this.props.selectOption}
        filterOption={(input, option) => {
          console.log(option.props.children.toLowerCase())
          console.log(slugify(input.toLowerCase()))
          return slugify(option.props.children.toLowerCase()).indexOf(slugify(input.toLowerCase())) >= 0
        }}
      >
        {this.props.option.map((el, index) => {
          return <Option value={'' + el.ma} key={index}>{el.ten + ' - ' + el.ma}</Option>
        })}
      </Select>
    )
  }
}

export default CustomSelect