import AntDesignVuePatch from './ant-design-vue.patch'
import AntDesignIconsPatch from './ant-design-icons.patch'

const patches = [
    AntDesignVuePatch,
    // AntDesignIconsPatch
]

patches.forEach(patch => patch())