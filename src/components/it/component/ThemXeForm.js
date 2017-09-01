import React from 'react'
import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
import PropTypes from 'prop-types';
import agent from '../../../agent'
const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
  
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        agent.IT.themXe(values)
          .then(res => {
            message.success('Them thanh cong')
            this.context.router.replace('/it');
          })
          .catch(err => {
            message.error('Them that bai')
          })
      }
    });
  }
  
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form" autoComplete="off">
        <div className="groupWr">
          
          <h3 className="header">Thông tin xe</h3>
          
          <FormItem>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: 'Không được để trống' }],
            })(
              <Input prefix={<Icon type="edit" style={{ fontSize: 13 }} />} placeholder="Tên xe"/>
            )}
          </FormItem>
          
          <FormItem>
            {getFieldDecorator('bks', {
              rules: [{ required: true, message: 'Không được để trống' }],
            })(
              <Input prefix={<Icon type="edit" style={{ fontSize: 13 }} />} placeholder="Biển kiểm soát"
              />
            )}
          </FormItem>
        
          <FormItem>
            {getFieldDecorator('trongtai', {
              rules: [{ required: true, message: 'Không được để trống' }],
            })(
              <Input type="number" prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Trọng tải" />
            )}
          </FormItem>
        </div>
        <FormItem>
          <Button type="primary" htmlType="submit" className="login-form-button" style={{width: 280, height: 60, fontSize: 40}}>
            Thêm xe mới
          </Button>
        </FormItem>
        
      </Form>
    );
  }
}

NormalLoginForm.contextTypes = {
  router: PropTypes.object.isRequired
};

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default WrappedNormalLoginForm
