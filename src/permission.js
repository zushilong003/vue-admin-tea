import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration
const whiteList = ['/login', 'imageView2'] // no redirect whitelist
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  const hasToken = window.sessionStorage.getItem('isLogin')
  console.info('permission-hasToken=' + hasToken)

  if (hasToken === 'true') {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      console.info('permission-login' + store.getters.name)
      next({ path: '/' })
      NProgress.done()
    } else {
      console.info('permission-getinfo' + store.getters.name)
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          console.info('permission-getinfo')
          // get user info
          // await store.dispatch('user/getInfo')
          next()
        } catch (error) {
          // remove token and go to login page to re-login
          //  await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          //  next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    // other pages that do not have permission to access are redirected to the login page.
    console.info('permission-redirect' + store.getters.name)
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
