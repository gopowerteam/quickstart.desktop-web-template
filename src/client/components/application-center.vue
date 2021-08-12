<template lang="pug">
.application-center.overflow-auto.py-20.px-10(@click.self='close')
    .application-search-wrapper.flex.justify-center(@click.self='close')
        a-input.application-search(ref='search' v-model:value='searchText')
    .application-list.py-10(@click.self='close')
        .application-group(v-for='(apps, group) in applications' :key='group')
            .group-title.py-5.font-bold {{ group }}
            .group-apps.py-5.flex.flex-wrap
                .application.mx-10.cursor-pointer(
                    v-for='app of apps'
                    :key='app.name'
                )
                    .icon.text-center
                        img.w-16.m-auto(
                            :src='app.icon'
                            :draggable='true'
                            @click.preserve='onOpenApp(app.name)'
                            @dragstart='onDragStart(app, $event)'
                            @dragend='onDragEnd'
                        )
                    .title.text-white.text-center.py-3 {{ app.title }}
    .application-dragging.absolute.flex.justify-center.items-center(
        v-if='dragging'
        @drop.prevent='onDrop'
        @dragover.prevent='onDragOver'
    )
        .div.text-lg 创建桌面快捷图标
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { Observable } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import { inject, onMounted, onUnmounted, ref, watch } from 'vue'

import { IStore } from '@/store'
import { groupBy } from '@/shared/utils/common.util'
import { useGraphql } from '@/graphql'
import { Modal } from 'ant-design-vue'
const graphql = useGraphql()
const store = useStore(IStore)
ref: searchText = ''
ref: search = ref<HTMLElement>()
ref: dragging = ref(false)

// 关闭应用中心
const close = inject('close:application-center') as any

// 应用列表
const applications = ref<any[]>(getAppGroup())

/**
 * 打开应用
 */
function onOpenApp(app) {
    store.commit('app/openApp', app)
    close()
}

/**
 * 获取应用分组
 */
function getAppGroup(value?) {
    const apps = store.state.app.applications.filter(
        x => !value || x.title.includes(value)
    )

    const groups = groupBy(apps, 'group.title')
    return groups
}

/**
 * 图标拖拽
 **/
function onDragStart(app, { dataTransfer }) {
    dragging = true

    dataTransfer.dropEffect = 'move'
    dataTransfer.setData('text/plain', app.name)
}

function onDragEnd(event) {
    dragging = false
}

function onDrop({ dataTransfer }) {
    const name = dataTransfer.getData('text')
    const app = store.state.app.applications.find(x => x.name == name)
    Modal.confirm({
        title: '创建桌面快捷方式',
        content: `是否确定创建应用 <${app.title}> 的桌面快捷方式?`,
        onOk() {
            addDesktopApp(app)
        }
    })
}

function onDragOver(event) {
    event.preventDefault()
}
/**
 * 应用搜索
 **/
function onSearchApp() {
    new Observable(subject => watch($searchText, value => subject.next(value)))
        .pipe(debounceTime(200))
        .subscribe(value => {
            applications.value = getAppGroup(value)
        })
}

/**
 * ESC响应
 */
function onEsc(e) {
    if (e.keyCode == 27) close()
}

/**
 * 添加桌面图标
 */
function addDesktopApp(app) {
    graphql
        .mutation({
            addUserDesktopApp: [
                {
                    app: app.name
                },
                {
                    result: true
                }
            ]
        })
        .then(({ addUserDesktopApp: { result } }) => {
            store.commit('app/updateDesktopApps', result)
        })
}

onMounted(() => {
    // 默认焦点
    search && search.focus()
    document.addEventListener('keyup', onEsc)

    onSearchApp()
})

onUnmounted(() => {
    document.removeEventListener('keyup', onEsc)
})
</script>

<style lang="stylus" scoped>
.application-center
  background:rgba(0,0,0,0.5)
  backdrop-filter: blur(5px)

  .application-search-wrapper
    .application-search
      width:300px
      height:40px
      background:rgba(50,50,50,0.8)
      border-color:rgba(255,255,255,0.3);
      color:#fff;
  .application-list
    .application-group
      .group-title
        font-size 18px
        color #fff
        text-shadow 0 0 10px rgba(255,255,255,0.8)
      .group-apps
        .application
          width 100px
          margin-bottom 10px
          .title
            height 5em
          .icon
            img
                border-radius 10px
  .application-dragging
    bottom 0
    left 0
    right 0
    height 300px
    background rgba(0,0,0,0.6)
    color #fff
</style>
