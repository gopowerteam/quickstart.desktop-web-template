<template lang="pug">
.application-center.overflow-auto.py-20.px-10(@click.self='close')
    .application-search-wrapper.flex.justify-center(@click.self='close')
        a-input.application-search(
            ref='search'
            @change.preserve='onSearchInput'
        )
    .application-list.py-10(@click.self='close')
        .application-group(v-for='(apps, group) in applications' :key='group')
            .group-title.py-5.font-bold {{ group }}
            .group-apps.py-5.flex.flex-wrap
                a-dropdown(
                    :trigger='["contextmenu"]'
                    v-for='app of apps'
                    :key='app.name'
                )
                    .application.mx-10.cursor-pointer(
                        @click.preserve='onOpenApp(app.name)'
                    )
                        .icon.text-center: img.w-16.m-auto(:src='app.icon')
                        .title.text-white.text-center.py-3 {{ app.title }}
                    template(#overlay)
                        a-menu(@click='onAction($event, app.name)')
                            a-menu-item(key='addDesktop') 创建桌面图标
</template>

<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue'
import { useStore } from 'vuex'
import { ApplicationList } from '@/config/application.config'
import { Observable, Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import { computed, inject, onMounted, onUnmounted, ref } from 'vue'

import { IStore } from '@/store'
import { groupBy } from '@/shared/utils/common.util'
import { applicationRequest } from '@/graphql/application.graph'
import { useRequest } from '@/graphql'

const store = useStore(IStore)
const subject = new Subject<string>()
const searchText = ref('')
const close = inject('close:application-center') as any
const search = ref()
const request = useRequest()

const actions = {
    addDesktop: addDesktop
}

// 应用列表
const applications = computed((): { [key: string]: any } => {
    const apps = store.state.app.applications
        .filter(x => store.state.app.userApplications.includes(x.name))
        .filter(x => x.title.includes(searchText.value))

    const groups = groupBy(apps, 'group.name')
    const defaultGroup = groups['']
    delete groups['']
    groups[''] = defaultGroup
    return groups
})

const onOpenApp = app => {
    close()
    store.commit('app/openApp', app)
}

var a = 5
function onSearchInput({ target: { value } }) {
    subject.next(value)
}

subject.pipe(debounceTime(100)).subscribe(name => {
    searchText.value = name
})

function onEsc(e) {
    if (e.keyCode == 27) close()
}

function onAction({ key }, app) {
    const action = actions[key]
    action && action(app)
}

function addDesktop(app) {
    request(applicationRequest.addUserDesktopApp, {
        userid: store.state.user.current?.id,
        app
    }).then(data => {
        store.dispatch('app/syncDesktopApps')
    })
}

onMounted(() => {
    console.log(store.state)
    const searchInput = search.value as any
    searchInput.focus()
    document.addEventListener('keyup', onEsc)
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
</style>
