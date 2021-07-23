<template lang="pug">
.page-container.absolute.inset-0.flex.justify-center.items-center
    .form-container.bg-white.py-10.px-32.relative
        .title.text-4xl.font-bold.text-center.text-blue-500 Welcome
        a-divider
        .tips.text-sm.text-blue-600.text-center
            span 请设置系统管理员
        .root-form.flex.flex-row
        a-form.w-60.py-5(
            ref='formRef'
            layout='vertical'
            :model='formModel'
            :rules='formRules'
        )
            a-form-item(label='用户名' name='username')
                a-input(v-model:value='formModel.username')
            a-form-item(label='密码' name='password')
                a-input-password(v-model:value='formModel.password')
            .flex.justify-center.pt-5
                a-button.w-36(type='primary' @click='onSubmit') 提交
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import { useStore } from 'vuex'
import { IStore } from '@/store'
import { useGraphql } from '@/graphql'
import { message } from 'ant-design-vue'

const router = useRouter()
const gql = useGraphql()
const store = useStore(IStore)

ref: formRef = null as any
ref: formModel = {
    username: '',
    password: ''
}

const formRules = {
    username: [
        {
            required: true,
            message: '请输入用户名'
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
            message: '请输入密码'
        },
        {
            min: 6,
            max: 10,
            message: '密码长度在6-10位'
        }
    ]
}

/**
 * 设置管理员
 */
async function onSubmit() {
    const setAdministrator = data =>
        gql.mutation({
            setAdministrator: [
                {
                    user: {
                        ...data,
                        role: 'admin'
                    }
                },
                {
                    result: true
                }
            ]
        })

    await formRef
        .validate()
        .then(setAdministrator)
        .then(({ setAdministrator: { result: token } }) => {
            // 设置系统初始化状态
            store.commit('app/initialize', true)
            // 更新用户token
            store.commit('user/updateToken', token)
            // 跳转根页面
            router.push('/')
        })
        .catch(() => {
            message.error('设置失败')
        })
}
</script>

<style lang="stylus" scoped>
.page-container
  background-image:url('/wallpapers/wallpaper-02.jpg')
  background-size: 100% 100%;
  overflow: hidden;

  .form-container
    min-width:400px;
    border-radius:5px

    .login-button
      width:50px;
      height:50px;
</style>
