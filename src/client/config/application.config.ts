export const ApplicationList = [
    {
        name: 'user-manage',
        icon: '/icons/user.png',
        title: '用户管理',
        root: () => import('@apps/user-manage/user-manage.vue'),
        maximize: true,
        admin: true
    },
    {
        name: 'desktop-manage',
        icon: '/icons/appstore.png',
        title: '桌面管理',
        root: () => import('@apps/desktop-manage/desktop-manage.vue'),
        admin: true
    }
]
