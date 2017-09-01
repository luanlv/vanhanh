import React from 'react'
import {Row, Col, Input, Button, message, Select, AutoComplete, InputNumber} from 'antd'
import {slugify} from '../_function'
const Option = Select.Option;

class CustomSelect extends React.Component {
  render () {
    return (
      <Select
        showSearch
        style={{ width: "32%", marginLeft: 5, marginTop: 5  }}
        value={this.props.value}
        optionFilterProp="children"
        placeholder="Tỉnh thành"
        labelInValue={true}
        onChange={this.props.handleChange}
        onSelect={this.props.selectOption}
        filterOption={(input, option) => slugify(option.props.children.toLowerCase()).indexOf(slugify(input.toLowerCase())) >= 0}
      >
        <Option value="angiang">An Giang</Option>
        <Option value="bariavungtau">	Bà Rịa-Vũng Tàu</Option>
        <Option value="baclieu">Bạc Liêu</Option>
        <Option value="backan">Bắc Kạn</Option>
        <Option value="bacgiang">Bắc Giang</Option>
        <Option value="bacninh">Bắc Ninh</Option>
        <Option value="bentre">Bến Tre</Option>
        <Option value="binhduong">Bình Dương</Option>
        <Option value="binhdinh">Bình Định</Option>
        <Option value="binhphuoc">Bình Phước</Option>
        <Option value="binhthuan">Bình Thuận</Option>
        <Option value="camau">Cà Mau</Option>
        <Option value="caobang">Cao Bằng</Option>
        <Option value="cantho">Cần Thơ</Option>
        <Option value="danan">Đà Nẵng</Option>
        <Option value="daklak">Đắk Lắk</Option>
        <Option value="daknong">Đắk Nông</Option>
        <Option value="dienbien">Điện Biên</Option>
        <Option value="dongnai">Đồng Nai</Option>
        <Option value="dongthap">Đồng Tháp</Option>
        <Option value="gialai">Gia Lai</Option>
        <Option value="hagiang">Hà Giang</Option>
        <Option value="hanam">Hà Nam</Option>
        <Option value="hanoi">Hà Nội</Option>
        <Option value="hatinh">Hà Tĩnh</Option>
        <Option value="haiduong">Hải Dương</Option>
        <Option value="haiphong">Hải Phòng</Option>
        <Option value="haugiang">Hậu Giang</Option>
        <Option value="hoabinh">Hòa Bình</Option>
        <Option value="hochiminh">Thành phố Hồ Chí Minh</Option>
        <Option value="hungyen">Hưng Yên</Option>
        <Option value="khanhhoa">Khánh Hoà</Option>
        <Option value="kiengiang">Kiên Giang</Option>
        <Option value="kontum">Kon Tum</Option>
        <Option value="laichau">Lai Châu</Option>
        <Option value="langson">Lạng Sơn</Option>
        <Option value="laocai">Lào Cai</Option>
        <Option value="lamdong">Lâm Đồng</Option>
        <Option value="longan">Long An</Option>
        <Option value="namdinh">Nam Định</Option>
        <Option value="nghean">Nghệ An</Option>
        <Option value="ninhbinh">Ninh Bình</Option>
        <Option value="ninhthuan">Ninh Thuận</Option>
        <Option value="phutho">Phú Thọ</Option>
        <Option value="phuyen">Phú Yên</Option>
        <Option value="quangbinh">Quảng Bình</Option>
        <Option value="quangnam">Quảng Nam</Option>
        <Option value="quangngai">Quảng Ngãi</Option>
        <Option value="quangninh">Quảng Ninh</Option>
        <Option value="quangtri">Quảng Trị</Option>
        <Option value="soctrang">Sóc Trăng</Option>
        <Option value="sonla">Sơn La</Option>
        <Option value="tayninh">Tây Ninh</Option>
        <Option value="thaibinh">Thái Bình</Option>
        <Option value="thainguyen">Thái Nguyên</Option>
        <Option value="thuathienhue">Thừa Thiên-Huế</Option>
        <Option value="tiengiang">Tiền Giang</Option>
        <Option value="travinh">Trà Vinh</Option>
        <Option value="tuyenquang">Tuyên Quang</Option>
        <Option value="vinhlong">	Vĩnh Long</Option>
        <Option value="vinhphuc">Vĩnh Phúc</Option>
        <Option value="yenbai">Yên Bái</Option>
      </Select>
    )
  }
}

export default CustomSelect