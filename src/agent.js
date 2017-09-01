import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = 'http://localhost:8000';
const API_ROOT_SOCKET = 'http://localhost:8001';

// const API_ROOT = 'http://192.168.1.100:8000';

// const API_ROOT = 'http://api.colombus.vn';
// const API_ROOT_SOCKET = 'http://api.colombus.vn:8001';

const encode = encodeURIComponent;
const responseBody = res => res.body;

let token = null;
const tokenPlugin = req => {
  if (token) {
    req.set('authorization', `Token ${token}`);
  }
}

const requests = {
  del: url =>
    superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  get: url =>
    superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  put: (url, body) =>
    superagent.put(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
  post: (url, body) =>
    superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody)
};

const Auth = {
  current: () =>
    requests.get('/user'),
  login: (username, password) =>
    requests.post(`/users/login`, { user: { username, password } }),
  register: (username, email, password) =>
    requests.post('/users', { user: { username, email, password } }),
  save: user =>
    requests.put('/user', { user })
};

const Tags = {
  getAll: () => requests.get('/tags')
};

const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;
const omitSlug = article => Object.assign({}, article, { slug: undefined })
const Articles = {
  all: page =>
    requests.get(`/articles?${limit(10, page)}`),
  byAuthor: (author, page) =>
    requests.get(`/articles?author=${encode(author)}&${limit(5, page)}`),
  byTag: (tag, page) =>
    requests.get(`/articles?tag=${encode(tag)}&${limit(10, page)}`),
  del: slug =>
    requests.del(`/articles/${slug}`),
  favorite: slug =>
    requests.post(`/articles/${slug}/favorite`),
  favoritedBy: (author, page) =>
    requests.get(`/articles?favorited=${encode(author)}&${limit(5, page)}`),
  feed: () =>
    requests.get('/articles/feed?limit=10&offset=0'),
  get: slug =>
    requests.get(`/articles/${slug}`),
  unfavorite: slug =>
    requests.del(`/articles/${slug}/favorite`),
  update: article =>
    requests.put(`/articles/${article.slug}`, { article: omitSlug(article) }),
  create: article =>
    requests.post('/articles', { article })
};

const Comments = {
  create: (slug, comment) =>
    requests.post(`/articles/${slug}/comments`, { comment }),
  delete: (slug, commentId) =>
    requests.del(`/articles/${slug}/comments/${commentId}`),
  forArticle: slug =>
    requests.get(`/articles/${slug}/comments`)
};

const Profile = {
  follow: username =>
    requests.post(`/profiles/${username}/follow`),
  get: username =>
    requests.get(`/profiles/${username}`),
  unfollow: username =>
    requests.del(`/profiles/${username}/follow`)
};

const LaiXe = {
  themDO: data =>
    requests.post('/laixe/do/them', {data}),
  nhanDO: data =>
    requests.post('/laixe/do/chapnhan', {data}),
  ketthucDO: data =>
    requests.post('/laixe/do/ketthuc', {data}),
  huyDO: data =>
    requests.post('/laixe/do/huyDO', {data}),
  capnhapDO: data =>
    requests.post('/laixe/do/capnhap', {data}),
  themPhuPhi: data =>
    requests.post('/laixe/phuphi/them', {data}),
  capnhapPhuPhi: data =>
    requests.post('/laixe/phuphi/capnhap', {data}),
  listDO: () =>
    requests.get(`/laixe/do/all`),
  listPhuPhi: () =>
    requests.get(`/laixe/phuphi/all`),
  DObyId: (id) =>
    requests.get(`/laixe/do/get/${id}`),
  PhuPhibyId: (id) =>
    requests.get(`/laixe/phuphi/get/${id}`),
  autofill: () =>
    requests.get(`/laixe/autofill/all`),
  changePass: data =>
    requests.post(`/laixe/users/password`, {data}),
}

const IT = {
  themThauPhu: data =>
    requests.post('/it/users/themthauphu', {data}),
  themDieuHanh: data =>
    requests.post('/it/users/themdieuhanh', {data}),
  danhsachThauPhu: () =>
    requests.get('/it/users/danhsachthauphu'),
  danhsachxe: () =>
    requests.get('/it/xe/danhsachxe'),
  themLaiXe: data =>
    requests.post('/it/users/themlaixe', {data}),
  themAutoFill: (data) =>
    requests.post(`/it/autofill/new`, data),
  themXe: data =>
    requests.post('/it/xe/them', {data}),
}

const DieuHanh = {
  listDOchuaxacnhan: () =>
    requests.get('/dieuhanh/do/chuaxacnhan'),
  getDOs: () =>
    requests.get('/dieuhanh/do/all'),
  listDOchuaphancong: () =>
    requests.get('/dieuhanh/do/chuaphancong'),
  listDODaNhan: () =>
    requests.get('/dieuhanh/do/danhan'),
  listDOChuaNhan: () =>
    requests.get('/dieuhanh/do/chuanhan'),
  // duyet: (id, action) =>
  //   requests.post('/dieuhanh/do/duyet', {id: id, action: action}),
  duyetphuphi: (id, action) =>
    requests.post('/dieuhanh/phuphi/duyet', {id: id, action: action}),
  DObyId: (id) =>
    requests.get(`/dieuhanh/do/get/${id}`),
  autofill: () =>
    requests.get(`/dieuhanh/autofill/all`),
  autofillPlace: () =>
    requests.get(`/dieuhanh/autofill/allPlace`),
  place: (input) =>
    requests.get(`/dieuhanh/autofill/search?v=${input}`),
  codeToPlace: data =>
    requests.post('/dieuhanh/autofill/diadiemtheocode', {data}),
  capnhapDO: data =>
    requests.post('/dieuhanh/do/capnhap', {data}),
  chonlaixe: data =>
    requests.post('/dieuhanh/do/chonlaixe', {data}),
  nhanLenhThay: data =>
    requests.post('/dieuhanh/do/nhanlenhthay', {data}),
  huyLenhThay: data =>
    requests.post('/dieuhanh/do/huylenhthay', {data}),
  huyChuyen: data =>
    requests.post('/dieuhanh/do/huychuyen', {data}),
  huyChuyen2: data =>
    requests.post('/dieuhanh/do/huychuyen2', {data}),
  duyet: data =>
    requests.post('/dieuhanh/do/duyet', {data}),
  daGiaoHang: data =>
    requests.post('/dieuhanh/do/dagiaohang', {data}),
  listPhuPhi: () =>
    requests.get(`/dieuhanh/phuphi/chuaxacnhan`),
  PhuPhibyId: (id) =>
    requests.get(`/dieuhanh/phuphi/get/${id}`),
  capnhapPhuPhi: data =>
    requests.post('/dieuhanh/phuphi/capnhap', {data}),
  danhsachlaixe: () =>
    requests.get('/dieuhanh/users/danhsachlaixe'),
  danhsachxe: () =>
    requests.get('/danhsachxe'),
  themDO: data =>
    requests.post('/dieuhanh/do/them', {data}),
  themAutoFill: (data) =>
    requests.post(`/dieuhanh/autofill/new`, data),
  themDiaDiem: (data) =>
    requests.post(`/dieuhanh/autofill/newPlace`, data),
  
  danhSachThauPhu: () =>
    requests.get('/danhsachthauphu'),
  themThauPhu: data =>
    requests.post('/dieuhanh/users/themthauphu', {data}),
  themLaiXe: data =>
    requests.post('/dieuhanh/users/themlaixe', {data}),
  themXe: data =>
    requests.post('/dieuhanh/xe/them', {data}),
  getDate: () =>
    requests.get('/date'),
  getThongKe: (start, end, thauphu) =>
    requests.get(`/dieuhanh/do/thongke?start=${start}&end=${end}&thauphu=${thauphu}`),
}


const NhanSu = {
  themPhongBan: data =>
    requests.post('/nhansu/phongban/themmoi', {data}),
  themNhanVien: data =>
    requests.post('/nhansu/nhanvien/themmoi', {data}),
  tatCaPhongBan: () =>
    requests.get(`/nhansu/phongban/all`),
  tatCaNhanVien: () =>
    requests.get(`/nhansu/nhanvien/all`),
}

export default {
  API_ROOT_SOCKET,
  API_ROOT,
  Articles,
  Auth,
  Comments,
  Profile,
  Tags,
  LaiXe,
  IT,
  DieuHanh,
  // ThauPhu,
  NhanSu,
  setToken: _token => { token = _token; }
};
