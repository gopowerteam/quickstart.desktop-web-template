import { App } from 'vue'
import DataCard from '@/shared/components/data-card.vue'
import DataForm from '@/shared/components/data-form.vue'
import DataTable from '@/shared/components/data-table.vue'
import PageContainer from '@/shared/components/page-container.vue'
import LabelContainer from '@/shared/components/label-container.vue'
import LabelItem from '@/shared/components/label-item.vue'
import ColumnContainer from '@/shared/components/column-container.vue'
import ColumnItem from '@/shared/components/column-item.vue'
import Upload from '@/shared/components/upload.vue'
import CloseSvg from '@/assets/icons/svg/close.svg'
import CheckSvg from '@/assets/icons/svg/check.svg'

export const registerGlobalComponents = (app: App) => {
    app.component('PageContainer', PageContainer)
    app.component('DataCard', DataCard)
    app.component('DataForm', DataForm)
    app.component('DataTable', DataTable)
    app.component('LabelContainer', LabelContainer)
    app.component('LabelItem', LabelItem)
    app.component('Upload', Upload)
    app.component('ColumnContainer', ColumnContainer)
    app.component('ColumnItem', ColumnItem)

    app.component('CloseSvg', CloseSvg as any)
    app.component('CheckSvg', CheckSvg as any)
}

declare global {
    interface __VLS_GlobalComponents {
        DataCard: typeof DataCard
        DataForm: typeof DataForm
        DataTable: typeof DataTable
        PageContainer: typeof PageContainer
        LabelContainer: typeof LabelContainer
        LabelItem: typeof LabelItem
        Upload: typeof Upload
    }
}
