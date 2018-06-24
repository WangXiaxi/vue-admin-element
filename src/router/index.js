import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');


//正式
const home = r => require.ensure([], () => r(require('@/page/home')), 'home');
const adminslist = r => require.ensure([], () => r(require('@/page/records/adminslist')), 'adminslist');
const rolelist = r => require.ensure([], () => r(require('@/page/records/rolelist')), 'rolelist');
const module = r => require.ensure([], () => r(require('@/page/records/module')), 'module');
const modulelist = r => require.ensure([], () => r(require('@/page/records/modulelist')), 'modulelist');
const shoplist = r => require.ensure([], () => r(require('@/page/member/shoplist')), 'shoplist');
const shopexamine = r => require.ensure([], () => r(require('@/page/member/shopexamine')), 'shopexamine');
const railway = r => require.ensure([], () => r(require('@/page/member/railway')), 'railway');
const login = r => require.ensure([], () => r(require('@/page/records/login')), 'login');
const register = r => require.ensure([], () => r(require('@/page/records/register')), 'register');
const forget = r => require.ensure([], () => r(require('@/page/records/forget')), 'forget');
//会员管理
const carauditlist = r => require.ensure([], () => r(require('@/page/member/carauditlist')), 'carauditlist');
const busManagement = r => require.ensure([], () => r(require('@/page/member/busManagement')), 'busManagement');
//市场管理
const agentlist = r => require.ensure([], () => r(require('@/page/market/agentlist')), 'agentlist');
const parameter = r => require.ensure([], () => r(require('@/page/market/parameter')), 'parameter');
const mail = r => require.ensure([], () => r(require('@/page/market/mail')), 'mail');
const joinmessage = r => require.ensure([], () => r(require('@/page/market/joinmessage')), 'joinmessage');
  //文章资讯
const articleEdit = r => require.ensure([], () => r(require('@/page/website/article-edit')), 'articleEdit');
const articleList = r => require.ensure([], () => r(require('@/page/website/article-list')), 'articleList');
//运营管理
const goodstype = r => require.ensure([], () => r(require('@/page/operate/goodstype')), 'goodstype');
const carmodel = r => require.ensure([], () => r(require('@/page/operate/carmodel')), 'carmodel');
const feedback = r => require.ensure([], () => r(require('@/page/operate/feedback')), 'feedback');
//财务管理
const withdrawals = r => require.ensure([], () => r(require('@/page/finance/withdrawals')), 'withdrawals');
const inthepresent = r => require.ensure([], () => r(require('@/page/finance/inthepresent')), 'inthepresent');
const recharge = r => require.ensure([], () => r(require('@/page/finance/recharge')), 'recharge');
const bail = r => require.ensure([], () => r(require('@/page/finance/bail')), 'bail');
const commissions = r => require.ensure([], () => r(require('@/page/finance/commissions')), 'commissions');
const membership = r => require.ensure([], () => r(require('@/page/finance/membership')), 'membership');
//订单管理
const waybill = r => require.ensure([], () => r(require('@/page/order/waybill')), 'waybill');
const cancelled = r => require.ensure([], () => r(require('@/page/order/cancelled')), 'cancelled');
const evaluate = r => require.ensure([], () => r(require('@/page/order/evaluate')), 'evaluate');
//平台管理
const commissionSetting = r => require.ensure([], () => r(require('@/page/platformManagement/commissionSetting')), 'commissionSetting');
const specialLine = r => require.ensure([], () => r(require('@/page/platformManagement/specialLine')), 'specialLine');

const routes = [
  {
    path: '/',
    component: login
  },
  {
    path: '/register',
    component: register
  },
  {
    path: '/forget',
    component: forget
  },
  {
    path: '/manage',
    component: manage,
    name: '',
    children: [
      {
        path: '/',
        component: home,
        meta: {
          loginVericat: true
        }
      },
      {
        path: '/adminslist',
        component: adminslist,
        meta: {
          titArr: ['系统管理', '管理员列表'],
          loginVericat: true
        }
      }
      , {
        path: '/rolelist',
        component: rolelist,
        meta: {
          titArr: ['系统管理', '管理员角色'],
          loginVericat: true
        }
      }, {
        path: '/module',
        component: module,
        meta: {
          titArr: ['系统管理', '功能权限'],
          loginVericat: true
        }
      }, {
        path: '/modulelist',
        component: modulelist,
        meta: {
          titArr: ['系统管理', '功能权限'],
          loginVericat: true
        }
      }, {
        path: '/shoplist',
        component: shoplist,
        meta: {
          titArr: ['会员管理', '会员列表'],
          loginVericat: true
        }
      },
      {
        path: '/shopexamine',
        component: shopexamine,
        meta: {
          titArr: ['会员管理', '会员审核'],
          loginVericat: true
        }
      }, 
      {
        path: '/busManagement',
        component: busManagement,
        meta: {
          titArr: ['会员管理', '商户管理'],
          loginVericat: true
        }
      }, 
      {
        path: '/railway',
        component: railway,
        meta: {
          titArr: ['会员管理', '专线列表'],
          loginVericat: true
        }
      }, {
        path: '/carauditlist',
        component: carauditlist,
        meta: {
          titArr: ['会员管理', '货车审核列表'],
          loginVericat: true
        }
      },
       {
        path: '/agentlist',
        component: agentlist,
        meta: {
          titArr: ['市场管理', '代理招商'],
          loginVericat: true
        }
      }, {
        path: '/parameter',
        component: parameter,
        meta: {
          titArr: ['市场管理', '参数管理'],
          loginVericat: true
        }
      }, {
        path: '/joinmessage',
        component: joinmessage,
        meta: {
          titArr: ['市场管理', '加盟留言'],
          loginVericat: true
        }
      }, {
        path: '/mail',
        component: mail,
        meta: {
          titArr: ['市场管理', '站内信'],
          loginVericat: true
        }
      },
      {
        path: '/article-edit',
        component: articleEdit,
        meta: {
          titArr: ['市场管理', '文章编辑'],
          loginVericat: true
        }
      }, {
        path: '/article-list',
        component: articleList,
        meta: {
          titArr: ['市场管理', '文章列表'], 
          loginVericat: true
        }
      },
      {
        path: '/goodstype',
        component: goodstype,
        meta: {
          titArr: ['运营管理', '货物类型'],
          loginVericat: true
        }
      }, {
        path: '/feedback',
        component: feedback,
        meta: {
          titArr: ['运营管理', '意见反馈'],
          loginVericat: true
        }
      }, {
        path: '/carmodel',
        component: carmodel,
        meta: {
          titArr: ['运营管理', '车型'],
          loginVericat: true
        }
      }, {
        path: '/withdrawals',
        component: withdrawals,
        meta: {
          titArr: ['财务管理', '提现记录'],
          loginVericat: true
        }
      }, {
        path: '/inthepresent',
        component: inthepresent,
        meta: {
          titArr: ['财务管理', '提现管理'],
          loginVericat: true
        }
      },
       {
        path: '/membership',
        component: membership,
        meta: {
          titArr: ['财务管理', '会员账户'],
          loginVericat: true
        }
      }, {
        path: '/bail',
        component: bail,
        meta: {
          titArr: ['财务管理', '保证金'],
          loginVericat: true
        }
      }, {
        path: '/commissions',
        component: commissions,
        meta: {
          titArr: ['财务管理', '佣金收入'],
          loginVericat: true
        }
      }, 
      {
        path: '/recharge',
        component: recharge,
        meta: {
          titArr: ['财务管理', '充值记录'],
          loginVericat: true
        }
      }, {
        path: '/waybill',
        component: waybill,
        meta: {
          titArr: ['订单管理', '运单列表'],
          loginVericat: true
        }
      }, {
        path: '/evaluate',
        component: evaluate,
        meta: {
          titArr: ['订单管理', '运单评价'],
          loginVericat: true
        }
      }, {
        path: '/cancelled',
        component: cancelled,
        meta: {
          titArr: ['订单管理', '取消的运单'],
          loginVericat: true
        }
      }
      , {
        path: '/commissionSetting',
        component: commissionSetting,
        meta: {
          titArr: ['平台管理', '佣金设置'],
          loginVericat: true
        }
      }
      , {
        path: '/specialLine',
        component: specialLine,
        meta: {
          titArr: ['平台管理', '专线限制'],
          loginVericat: true
        }
      }
      ]
    }
  ]

export default new Router({
  // mode: 'history',
  routes,
  strict: process.env.NODE_ENV !== 'production',
})
