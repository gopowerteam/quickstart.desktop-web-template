<template lang="pug">
.page-container.flex.justify-end.items-center
    .login-container.p-16
        .welcome.text-blue-500 Welcome
        a-form.login-form.py-10(
            :model='formModel'
            layout='vertical'
            :rules='formRules'
            @submit='onSubmit'
        )
            a-form-item(label='用户名' name='username')
                a-input(v-model:value='formModel.username')
            a-form-item(label='密码' name='password')
                a-input-password(v-model:value='formModel.password')
            .flex.justify-center.pt-10
                a-button.w-36(type='primary' htmlType='submit') 登录
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRaw } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { message } from 'ant-design-vue'
import { IStore } from '@/store'
import { useGraphql } from '@/graphql'

const router = useRouter()
const store = useStore(IStore)
const gql = useGraphql()

// #region Variable
ref: formModel = {
    username: '',
    password: ''
}

const formRules = {
    username: [
        {
            required: true,
            message: '用户名不能为空'
        },
        {
            min: 4,
            max: 10,
            message: '用户名长度在4-10位'
        }
    ],
    password: [
        {
            required: true,
            message: '密码不能为空'
        },
        {
            min: 6,
            max: 10,
            message: '密码长度在6-10位'
        }
    ]
}

// #endregion

// #region Function
// 用户登陆
function onSubmit() {
    const { username, password } = toRaw(formModel)

    const loginRequest = gql.query({
        loginByPassword: [
            {
                username,
                password
            },
            {
                data: true
            }
        ]
    })

    loginRequest
        .then(({ loginByPassword: { data: token } }) => {
            // 更新用户token
            store.commit('user/updateToken', token)
            // 跳转根页面
            router.push({ path: '/' })
        })
        .catch(ex => {
            message.error('用户名或密码错误')
        })
}

// 初始化
onMounted(() => {})

// #endregion
</script>

<style lang="stylus" scoped>
.page-container
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-image:url('/wallpapers/wallpaper-02.jpg')
  background-size: 100% 100%;
  overflow: hidden;

  .login-container
    position:relative
    margin-right:200px;
    height:450px
    width:400px;
    background:#fff;
    border-radius:5px;
    box-shadow:0 0 5px 5px rgba(0,0,0,0.3)

    .welcome
      font-size:24px
      font-weight:bold

    .login-form
      .ant-input
        border:none;
        border-bottom:solid 1px rgba(0,0,0,0.1)
        padding:5px 0;
        &:focus
          border-bottom:solid 1px rgba(59, 130, 246, 0.5)
          outline: 0;
          box-shadow: none;

    .login-button
      position:absolute;
      right:-40px;
      bottom:100px;
      width:75px
      height:75px
      border-radius:100%
</style>
