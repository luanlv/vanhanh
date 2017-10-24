import React from 'react';
// import createClass from 'create-react-class';
import PropTypes from 'prop-types';
import Select from 'react-select';
import fetch from 'isomorphic-fetch';
import agent from '../../../agent'
import 'react-select/dist/react-select.css';
import {intersection, bindAll} from 'lodash'
import CreatePlace from './CreatePlace'
import {Button} from 'antd'

class SelectPlace extends React.PureComponent {
  constructor(props) {
    super(props)
    
    let value = this.props.defaultValue
    if(props.multi){
      value = this.props.defaultValue ? this.props.defaultValue.map(el => {
        el.label = el.name + ' - ' + el.code
        return el
      }) : []
    } else {
      if(value){
        value.label = value.name + ' - ' + value.code
      }
    }
    
    this.state = {
      value: value,
      backspaceRemoves: false,
      multi: true
    }

    bindAll(this, 'addNew', 'onChange', 'getUsers', 'gotoUser')

  }
  
  onChange(value) {
    this.setState({
      value: value,
    });
    if(this.props.onChange) this.props.onChange(value)
  }

  getUsers = async (input) => {
    let place = await agent.DieuHanh.place(input)
    // console.log(place)
    return { options: place }
  }
  
  gotoUser (value, event) {
    window.open(value.html_url);
  }
  
  addNew(obj){
    let value = this.state.value
    obj.label = obj.name + ' - ' + obj.code;
    if(this.props.multi){
      value.push(obj)
    } else {
      value = obj
    }
    this.setState({value: value})
    this.places.focus()
    if(this.props.onChange) this.props.onChange(value)
  }
  
  render () {
    const AsyncComponent = Select.Async
    // console.log('dia diem')
    // console.log(this.props.multi)
    // console.log(this.state.value)
    return (
      <div className="section">
        <AsyncComponent multi={this.props.multi}
                        value={this.state.value}
                        onChange={this.onChange}
                        onValueClick={this.gotoUser}
                        valueKey="code"
                        // labelKey="name"
                        loadOptions={this.getUsers}
                        ignoreCase={true}
                        placeholder="Địa điểm"
                        searchPromptText="Tìm kiếm địa điểm"
                        backspaceRemoves={this.state.backspaceRemoves}
                        ref={(input) => { this.places = input; }} />
        <CreatePlace
          newOK={this.addNew}
        />
        {this.props.multi && <Button
          style={{float: 'right'}}
          onClick={async () => {
            let listCode = prompt("Dánh sách các mã");
            let places = await agent.DieuHanh.codeToPlace(listCode)
            let notFound = []
            let listCodeArr = listCode.split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } )
            listCodeArr.forEach(el => {
              if(places.findIndex(pl => {return pl.code ===  el}) < 0 ){
                notFound.push(el);
              }
            })
            alert("Không tìm thấy địa điểm có mã: " + notFound.join(', '))
            places.map(el => {
              el.label = el.name + " - " + el.code
              return el
            })
            let value = this.state.value
            places.forEach(el => {
              if(getIndex(el, value) < 0) value.push(el)
            })
            this.setState({value: value})
            this.places.focus()
            if(this.props.onChange) this.props.onChange(value)
          }}
        >Thêm theo mã</Button>
        }
      </div>
      
    )
  }
  
}

export default SelectPlace;

const getIndex = function(el, list){
  let result = -1
  for(let i=0; i < list.length; i++){
    if(list[i].code === el.code){
      result = i;
      return i;
    }
  }
  return result;
}