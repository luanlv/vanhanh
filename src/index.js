import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import store from './store';
import { LocaleProvider  } from 'antd-mobile';
// import viVN from 'antd-mobile/lib/locale-provider/vi_VN';
import App from './components/App';
import Home from './components/dashboard/Home';
import BangGia from './components/dieuhanh/BangGia2';
import ThongKe from './components/dieuhanh/ThongKe';
import DuyetChiPhi from './components/dieuhanh/DuyetChiPhi';
import DuyetChinhSua from './components/dieuhanh/DuyetChinhSua';
import DuyetChiPhiKeToan from './components/dieuhanh/DuyetChiPhiKeToan';
import ThongKeTheoLaiXe from './components/dieuhanh/ThongKeLaiXe';
import ThongKeTheoXe from './components/dieuhanh/ThongKeTheoXe';
import ThongKeTheoThauPhu from './components/dieuhanh/ThongKeTheoThauPhu';
import ThongKeTheoKhachHang from './components/dieuhanh/ThongKeTheoKhachHang';
import BieuDo from './components/dieuhanh/BieuDo';
import HomeDieuHanh from './components/dieuhanh/Home';
import SuaDiaChi from './components/dieuhanh/SuaDiaChi';
import SuaThauPhu from './components/dieuhanh/SuaThauPhu';
import SuaKhachHang from './components/dieuhanh/SuaKhachHang';
import DieuXe from './components/dieuhanh/DO';
import PhongBan from './components/nhansu/PhongBan';
import NhanVien from './components/nhansu/NhanVien';
import ThuChi from './components/thuquy/Quy';
import DoanhThu from './components/dieuhanh/DoanhThu';

ReactDOM.render((
    <Provider store={store}>
      <Router history={hashHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Home} />
          <Route path="do/dieuxe" component={HomeDieuHanh} />
          <Route path="phongban" component={PhongBan} />
          <Route path="nhanvien" component={NhanVien} />
          
          
          <Route path="thongke" component={ThongKe} />
          <Route path="thongketheolaixe" component={ThongKeTheoLaiXe} />
          <Route path="thongketheoxe" component={ThongKeTheoXe} />
          <Route path="thongketheothauphu" component={ThongKeTheoThauPhu} />
          <Route path="thongketheokhachhang" component={ThongKeTheoKhachHang} />
          <Route path="bieudo" component={BieuDo} />
          <Route path="thuchi" component={ThuChi} />

          <Route path="duyetchiphi" component={DuyetChiPhi} />
          <Route path="duyetchiphiketoan" component={DuyetChiPhiKeToan} />

          <Route path="duyetchinhsua" component={DuyetChinhSua} />

          <Route path="suadiachi" component={SuaDiaChi} />
          <Route path="suakhachhang" component={SuaKhachHang} />
          <Route path="suathauphu" component={SuaThauPhu} />

          <Route path="doanhthu" component={DoanhThu} />
          <Route path="banggia" component={BangGia} />

        </Route>
      </Router>
    </Provider>
), document.getElementById('root'));
