import Vue from 'vue'
// 按需导入组件
import { Message, Button, Form, FormItem, Input } from 'element-ui'
import { Container, Header, Aside, Main } from 'element-ui'
import { Menu, Submenu, MenuItem } from 'element-ui'
import { Breadcrumb, BreadcrumbItem, Card, Col, Row } from 'element-ui'
import { Table, TableColumn, Tooltip } from 'element-ui'
import { Pagination } from 'element-ui'
import { Dialog } from 'element-ui'
import { MessageBox } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Col)
Vue.use(Row)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm