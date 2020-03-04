<template>
  <div class="app-container">
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      align="left"
      highlight-current-row
      style="width: 100%"
      :cell-class-name="tableCellClassName"
      @cell-click="handleSelectionChange"
    >
      <el-table-column label="姓名" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.realname }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.userName }}
        </template>
      </el-table-column>
      <el-table-column label="密码" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.passWord }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="备注" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.tbDesc }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="验证码" width="160" align="center">
        <template slot-scope="scope">
          <img
            :src="scope.row.captchaUrl"
            alt="点我获取"
          >
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="验证输入" width="150" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.captcha" placeholder="请输入验证码" clearable />
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="150" align="center">
        <template slot-scope="scope">
          <el-tag type="danger">{{ scope.row.loginStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" width="" align="center">
        <template slot-scope="scope">
          <el-button type="success" @click="submit(scope.row)">登录</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { queryUserList, getCaptCha, cyLogin } from '@/api/table'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      pageUrl: 'url',
      picCode: 'code',
      listLoading: true,
      multipleTable: [],
      submitLogin: {
        code: '',
        userName: '',
        passWord: '',
        realname: '',
        roles: '',
        tbDesc: '',
        captchaId: '',
        captchaUrl: '',
        captcha: '',
        token: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      queryUserList().then(response => {
        console.info(response.info)
        this.list = response.info
        this.listLoading = false
      })
    },
    submit(row) {
      console.info('-row-' + row)
      this.submitLogin.code = row.code
      this.submitLogin.userName = row.userName
      this.submitLogin.passWord = row.passWord
      this.submitLogin.realname = row.realname
      this.submitLogin.roles = row.roles
      this.submitLogin.tbDesc = row.tbDesc
      this.submitLogin.captchaId = row.captchaId
      this.submitLogin.captchaUrl = row.captchaUrl
      this.submitLogin.captcha = row.captcha
      this.submitLogin.token = row.token
      cyLogin(this.submitLogin).then(response => {
        if (response.code === 200) {
          row.loginStatus = '成功'
          this.$message({
            message: '登录成功',
            type: 'success'
          })
        } else {
          row.loginStatus = '失败'
          this.$message({
            message: '失败：' + response.msg,
            type: 'warning'
          })
        }
      })
    },
    tableCellClassName({ row, column, rowIndex, columnIndex }) { // 注意这里是解构
      row.index = rowIndex
      column.index = columnIndex
    },
    handleSelectionChange(row, column, cell, event) {
      if (column.index === 4) {
        getCaptCha().then(response => {
          const url = 'https://www.5169168.com/' + response.info.CaptchaURI
          console.info(url)
          row.captchaUrl = url
          console.info(response.info.CaptchaId)
          row.captchaId = response.info.CaptchaId
        })
      }
    }
  }
}
</script>
