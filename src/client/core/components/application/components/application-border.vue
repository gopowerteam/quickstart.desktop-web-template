<template lang="pug">
.application-resize-bar.top-bar(@mousedown.prevent='onDragStart("top", $event)')
.application-resize-bar.bottom-bar(
    @mousedown.prevent='onDragStart("bottom", $event)'
)
.application-resize-bar.left-bar(
    @mousedown.prevent='onDragStart("left", $event)'
)
.application-resize-bar.right-bar(
    @mousedown.prevent='onDragStart("right", $event)'
)
.application-resize-bar.right-bottom-bar(
    @mousedown.prevent='onDragStart("right-bottom", $event)'
)
.application-resize-border(:style='position' v-if='dragging')
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'

const windowPosition = inject('position') as any
const dragging = ref<string>()
const position = ref({
    top: 0,
    right: 0,
    left: 0,
    bottom: 0
})

// 历史位置
let posX = 0
let posY = 0

const updatePosition = () => {
    switch (dragging.value) {
        case 'top':
            windowPosition.top += position.value.top
            windowPosition.height -= position.value.top
            break
        case 'bottom':
            windowPosition.height -= position.value.bottom
            break
        case 'left':
            windowPosition.left += position.value.left
            windowPosition.width -= position.value.left
            break
        case 'right':
            windowPosition.width -= position.value.right
            break
        case 'right-bottom':
            windowPosition.width -= position.value.right
            windowPosition.height -= position.value.bottom
    }

    if (windowPosition.width < windowPosition.minWidth) {
        windowPosition.width = windowPosition.minWidth
    }

    if (windowPosition.height < windowPosition.minHeight) {
        windowPosition.height = windowPosition.minHeight
    }
}

// 拖动处理
const onDragMove = e => {
    const x = posX - e.clientX
    const y = posY - e.clientY

    posX = e.clientX
    posY = e.clientY

    switch (dragging.value) {
        case 'top':
            position.value.top -= y
            break
        case 'bottom':
            position.value.bottom += y
            break
        case 'left':
            position.value.left -= x
            break
        case 'right':
            position.value.right += x
            break
        case 'right-bottom':
            position.value.right += x
            position.value.bottom += y
            break
    }
    // position.value.top -= top;
    // position.value.left -= left;
}

// 结束拖动监听
const onDragEnd = () => {
    // 更新位置
    updatePosition()
    // reset dragging
    dragging.value = ''
    // reset style
    position.value.top = 0
    position.value.bottom = 0
    position.value.left = 0
    position.value.right = 0
    document.removeEventListener('mouseup', onDragEnd)
    document.removeEventListener('mousemove', onDragMove)
}

// 开始拖动监听
const onDragStart = (direction, e) => {
    dragging.value = direction
    posX = e.clientX
    posY = e.clientY

    document.addEventListener('mouseup', onDragEnd)
    document.addEventListener('mousemove', onDragMove)
}
</script>

<style lang="stylus" scoped>
border-size=3px

.application-resize-bar
  position:absolute;
  opacity :0;
  &.top-bar
    height:border-size;
    width:100%
    top:0
    cursor:n-resize;

  &.bottom-bar
    height:border-size
    bottom:0
    width:100%
    cursor:s-resize;

  &.left-bar
    left:0
    height:100%
    width:border-size
    cursor:w-resize;

  &.right-bar
    right:0
    width:border-size
    height:100%
    cursor:e-resize;

  &.right-bottom-bar
    right:0
    bottom:0
    width:border-size
    height:border-size
    cursor:se-resize

.application-resize-border
  border:dotted 2px #000;
  position :absolute;
</style>
